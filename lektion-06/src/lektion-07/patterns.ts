export async function sequence<D, C, R>(steps: {
  draft: () => Promise<D>;
  check: (draft: D) => Promise<C>;
  approved: (check: C) => boolean;
  finish: (draft: D) => Promise<R>;
}) {
  const draft = await steps.draft();
  const check = await steps.check(draft);
  if (!steps.approved(check)) return { status: 'blocked' as const, draft, check };
  return { status: 'ok' as const, draft, check, result: await steps.finish(draft) };
}

export function concurrent<A, B, C>(a: () => Promise<A>, b: () => Promise<B>, c: () => Promise<C>) {
  return Promise.allSettled([Promise.resolve().then(a), Promise.resolve().then(b), Promise.resolve().then(c)] as const);
}
