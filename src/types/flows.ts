/* eslint-disable @typescript-eslint/no-explicit-any */
export interface FlowMeta {
  id: string;
  name: string;
}

export interface FlowNode {
  id: string;
  type: string;
  position: {
    x: number;
    y: number;
  };
  data: { [key: string]: any };
}

export interface FlowEdge {
  id: string;
  source: string;
  target: string;
  sourceHandle?: string;
  targetHandle?: string;
}

export interface Flow {
  id: string;
  name: string;
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export interface CreateFlowPayload {
  name: string;
  nodes?: FlowNode[];
  edges?: FlowEdge[];
}

export interface UpdateFlowPayload {
  name?: string;
  nodes?: FlowNode[];
  edges?: FlowEdge[];
}

export interface FlowResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    flow: Flow;
  };
}

export interface FlowListResponse {
  status: number;
  success: boolean;
  message: string;
  data: {
    flows: {
      id: string;
      name: string;
    }[];
  };
}

export interface BaseApiResponse {
  status: number;
  success: boolean;
  message: string;
  data?: any;
}
