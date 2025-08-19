/* eslint-disable @typescript-eslint/no-explicit-any */

import type { ApiResponse } from './api';

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

export type FlowResponse = ApiResponse<{
  flow: Flow;
}>;

export type FlowListResponse = ApiResponse<{
  flows: Flow[];
}>;

export type DeleteFlowResponse = ApiResponse;
