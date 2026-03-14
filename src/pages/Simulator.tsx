import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentPlayer } from "@/lib/score-manager";
import PageLayout from "@/components/PageLayout";
import CompilerSimulator from "@/components/CompilerSimulator";

const Simulator = () => {
  const navigate = useNavigate();
  useEffect(() => { if (!getCurrentPlayer()) navigate("/"); }, [navigate]);

  return (
    <PageLayout title="Compiler Phase Simulator">
      <CompilerSimulator />
    </PageLayout>
  );
};

export default Simulator;
