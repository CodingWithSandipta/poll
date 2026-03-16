
"use client";

import { useEffect, useState } from "react";
import { isAllowed, setAllowed, requestAccess, signTransaction } from "@stellar/freighter-api";
import { Client, networks } from "poll-client";

const client = new Client({
  ...networks.testnet,
  rpcUrl: "https://soroban-testnet.stellar.org",
});

export default function Home() {
  const [address, setAddress] = useState<string | null>(null);
  const [yesVotes, setYesVotes] = useState<number>(0);
  const [noVotes, setNoVotes] = useState<number>(0);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    checkFreighter();
    fetchVotes();
    const interval = setInterval(fetchVotes, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (address) {
      updateUserVotingStatus();
    }
  }, [address]);

  const checkFreighter = async () => {
    try {
      if (await isAllowed()) {
        const pk = await requestAccess();
        if (pk && pk.address) {
          setAddress(pk.address);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const updateUserVotingStatus = async () => {
    if (!address) return;
    try {
      const { result } = await client.has_voted({ voter: address });
      if (result === true) {
        setHasVoted(true);
      }
    } catch (e) {
      console.error("Failed to check voting status:", e);
    }
  };

  const connectWallet = async () => {
    try {
      await setAllowed();
      const access = await requestAccess();
      if (access && access.address) {
        setAddress(access.address);
      } else if (access && access.error) {
        throw new Error(access.error);
      }
    } catch (e: any) {
      alert("Failed to connect Freighter. " + e.message);
    }
  };

  const fetchVotes = async () => {
    try {
      const res = await client.get_votes();
      // Soroban returns BigInts for u32 sometimes in JS, ensure they are numbers
      if (res.result) {
        setYesVotes(Number(res.result[0]));
        setNoVotes(Number(res.result[1]));
      }
    } catch (e) {
      console.error("Failed to fetch votes:", e);
    } finally {
      setLoading(false);
    }
  };

  const castVote = async (voteYes: boolean) => {
    if (!address) {
      alert("Please connect your wallet first!");
      return;
    }

    setIsSubmitting(true);
    try {
      const tx = await client.vote(
        { voter: address, vote_yes: voteYes },
        { publicKey: address }
      );

      const response = await signTransaction(tx.built!.toXDR(), {
        networkPassphrase: "Test SDF Network ; September 2015",
      });

      if (response.error) {
        throw new Error(response.error);
      }

      const signedXdr = response.signedTxXdr;
      if (!signedXdr) throw new Error("Transaction signature failed");

      await tx.signAndSend({
        signTransaction: async () => ({ signedTxXdr: signedXdr })
      });

      alert("Vote successfully cast!");
      setHasVoted(true);
      fetchVotes();
    } catch (e: any) {
      console.error(e);
      if (e.message && e.message.includes("already voted")) {
        alert("Wait! Our records show you have already cast your vote.");
        setHasVoted(true);
      } else {
        alert("Transaction Failed: " + (e.message || "Unknown error"));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const totalVotes = yesVotes + noVotes;
  const yesPercent = totalVotes > 0 ? (yesVotes / totalVotes) * 100 : 0;
  const noPercent = totalVotes > 0 ? (noVotes / totalVotes) * 100 : 0;

  return (
    <main>
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
        {address ? (
          <div className="glass-card" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
            Connected: {address.slice(0, 4)}...{address.slice(-4)}
          </div>
        ) : (
          <button className="btn btn-primary" onClick={connectWallet}>
            Connect Freighter
          </button>
        )}
      </div>

      <h1 className="title">Soroban Network Poll</h1>

      <div className="glass-card" style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2>Do you support the Stellar Soroban Upgrade?</h2>
        <p style={{ color: 'var(--text-color)', marginBottom: '2rem' }}>
          {hasVoted ? "Thank you for participating! You have already voted." : "Connect your wallet to cast your vote on the blockchain."}
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button
            className="btn btn-success"
            disabled={!address || isSubmitting || hasVoted}
            onClick={() => castVote(true)}
          >
            {isSubmitting ? 'Voting...' : hasVoted ? '✓ Yes' : 'Vote Yes'}
          </button>
          <button
            className="btn btn-danger"
            disabled={!address || isSubmitting || hasVoted}
            onClick={() => castVote(false)}
          >
            {isSubmitting ? 'Voting...' : hasVoted ? 'No' : 'Vote No'}
          </button>
        </div>
      </div>

      <div className="glass-card">
        <h3>Live Results {loading && '(Loading...)'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>Yes Votes</span>
              <strong>{yesVotes} ({yesPercent.toFixed(1)}%)</strong>
            </div>
            <div style={{ width: '100%', height: '12px', background: 'var(--secondary-color)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${yesPercent}%`, height: '100%', background: 'var(--success-color)', transition: 'width 1s ease' }}></div>
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span>No Votes</span>
              <strong>{noVotes} ({noPercent.toFixed(1)}%)</strong>
            </div>
            <div style={{ width: '100%', height: '12px', background: 'var(--secondary-color)', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ width: `${noPercent}%`, height: '100%', background: 'var(--danger-color)', transition: 'width 1s ease' }}></div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
