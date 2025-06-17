import { SimplifiedComponentDefinition, SimplifiedComponentSetDefinition } from "./types";


export function sanitizeComponents(
  aggregatedComponents: Record<string, Component>,
): Record<string, SimplifiedComponentDefinition> {
  return Object.fromEntries(
    Object.entries(aggregatedComponents).map(([id, comp]) => [
      id,
      {
        id,
        key: comp.key,
        name: comp.name,
        componentSetId: comp.componentSetId,
      },
    ]),
  );
}

export function sanitizeComponentSets(
  aggregatedComponentSets: Record<string, ComponentSet>,
): Record<string, SimplifiedComponentSetDefinition> {
  return Object.fromEntries(
    Object.entries(aggregatedComponentSets).map(([id, set]) => [
      id,
      {
        id,
        key: set.key,
        name: set.name,
        description: set.description,
      },
    ]),
  );
}
