import type { Scenario } from '../../features/scenario/types';

/**
 * Every JSON file in this folder is a scenario. Files are ordered by filename
 * (e.g. `01-…`, `02-…`), which also defines the sequential unlock order.
 * Adding a new scenario = dropping a new JSON file here; no code changes.
 */
const modules = import.meta.glob<Scenario>('./*.json', { eager: true, import: 'default' });

export const scenarios: Scenario[] = Object.keys(modules)
  .sort()
  .map((path) => modules[path] as Scenario);

export function getScenario(id: string | undefined): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}

export function nextScenarioId(id: string): string | null {
  const index = scenarios.findIndex((s) => s.id === id);
  return scenarios[index + 1]?.id ?? null;
}
