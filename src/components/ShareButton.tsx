import React, { useEffect, useState } from "react";
import "../App.scss";

interface ShareButtonProps {
  shareUrl: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ shareUrl }) => {
  const [isCopied, setIsCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setIsCopied(true);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  useEffect(() => {
    setIsCopied(false);
  }, [shareUrl]);

  return (
    <div className="share-btn">
      <button onClick={copyToClipboard}>
        {isCopied ? "Copied!" : "Share"}
      </button>
    </div>
  );
};

export default ShareButton;
