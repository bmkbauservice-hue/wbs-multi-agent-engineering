/** Controlled output for the two customer-service exercises. No external actions. */
export function renderCompanyReply(value: unknown): string {
  if (!value || typeof value !== 'object') throw new Error('Missing reply analysis');
  const v = value as Record<string, unknown>;
  if (typeof v.deliveryDelayed !== 'boolean' || typeof v.messageUnanswered !== 'boolean') {
    throw new Error('Invalid reply analysis');
  }
  const problems = [v.deliveryDelayed ? 'the delivery delay' : '', v.messageUnanswered ? 'our unanswered email' : ''].filter(Boolean);
  const apology = problems.length ? `We apologise for ${problems.join(' and ')}.` : 'Thank you for sharing your feedback with us.';
  return `${apology} We would be happy to review your concerns and discuss possible next steps.`;
}

export function renderEscalation(value: unknown): string {
  if (!value || typeof value !== 'object') throw new Error('Missing escalation analysis');
  const v = value as Record<string, unknown>;
  const apologies = {
    product_mismatch: 'We are sorry the product did not meet your expectations.',
    delivery_problem: 'We are sorry about the delivery problem.',
    other: 'We are sorry about your experience.',
  } as const;
  if (typeof v.concern !== 'string' || !Object.hasOwn(apologies, v.concern)) throw new Error('Invalid escalation concern');
  return `[SIMULATION] ${apologies[v.concern as keyof typeof apologies]} No complaint or case has been submitted. In a real support process, we could discuss the available options or ask a manager to review the concern.`;
}
