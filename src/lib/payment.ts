/**
 * Organizer payment accounts shown to applicants on the registration form so
 * they know where to send the entry fee. Edit these to update them site-wide.
 */
export interface PaymentAccount {
  method: string;
  number: string;
  /** Optional title/account-holder name shown next to the number. */
  name?: string;
}

export const PAYMENT_ACCOUNTS: PaymentAccount[] = [
  { method: 'JazzCash', number: '0327 8625085', name: 'ADAN SAFEER' },
  { method: 'EasyPaisa', number: '0343 9200329', name: 'ADAN SAFEER' },
];
