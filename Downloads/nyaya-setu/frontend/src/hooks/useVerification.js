import { useState } from "react";
import { verifyDocuments } from "../services/verificationService.js";

export default function useVerification() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(formData) {
    setLoading(true);
    setError(null);
    try {
      return await verifyDocuments(formData);
    } catch (requestError) {
      setError(requestError);
      throw requestError;
    } finally {
      setLoading(false);
    }
  }

  return { loading, error, submit };
}
