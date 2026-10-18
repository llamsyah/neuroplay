import type { Metadata } from "next";
import AnatomyLab from "../../components/anatomy-lab";
import "./lab.css";

export const metadata: Metadata = {
  title: "NEUROPLAY · Phase 0 anatomy workbench",
  description: "Technical prototype for inspecting the source brain atlas and hippocampus reveal/isolation.",
};

export default function LabPage() {
  return <AnatomyLab />;
}
