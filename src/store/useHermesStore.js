import { create } from 'zustand';

export const useHermesStore = create((set, get) => ({
  // ---- DEFAULT STATE (editable via admin) ----
  hermesAgent: {
    title: "HERMES AGENT WORKING AREA",
    description:
      "Development zone for Hermes Agent interfaces, user flows, and experimental webapps.",
    currentStage: "INTERFACE DESIGN & PROTOTYPING",
    progress: 35,
    nextMilestone: "LIVE WORKING DEMO",
    interfacePreview: "/assets/interface.png",
    userFlowDiagram: "/assets/flow.png",
    layoutPrototype: "/assets/layout.png",
    tasks: [
      { id: "t1", description: "Define core interface components", status: "done" },
      { id: "t2", description: "Map primary user flows", status: "in-progress" },
      { id: "t3", description: "Build working prototype", status: "todo" },
      { id: "t4", description: "Integrate with live agent", status: "todo" },
      { id: "t5", description: "Deploy demo environment", status: "todo" },
    ],
  },

  // ---- ACTION ----
  setHermesAgent: (payload) =>
    set((state) => ({
      hermesAgent: { ...state.hermesAgent, ...payload },
    })),
}));