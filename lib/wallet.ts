const BASE_URL = "https://wallet-demo-435v2.ondigitalocean.app/";
const token = "40d80626-e63d-44fa-a801-595cc4624ed3";
const customerId = "93cf8b7a-c65a-480a-84e1-9a42d8fdfbd5"
const sessionId = "908734530-gh53-4535-tm51-fd1486nr352"

export async function loadBalance() {
    const res = await fetch(`${BASE_URL}user-wallet/v1/gaming/sessions/balance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        provider: "Hogamba",
        customer: {
        id: customerId,
        token
        }
      }),
    });
  
    const data = await res.json();
  
    if (data.status?.error) throw new Error(data.status.error_message);
    return {balance: data.balance / 100, currency: data.currency};
  }

  export async function placeBet(amount: number) {
    const res = await fetch(`${BASE_URL}user-wallet/v1/gaming/transactions/debit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transaction: {
          provider: "Hogamba",
          customer: {
            id: customerId,
            token,
            session_id: sessionId,
          },
          game_id: "hogamba_mines",
          spin_id: `spin_1234`,
          external_id: `external_1234`,
          amount: amount * 100,
          currency: "EUR"
        },
        free_spin: false
      })
    });
  
    const data = await res.json();
    if (data.status?.error) throw new Error(data.status.error_message);
    return data.balance / 100;
  }

  export async function processCashout(amount: number) {
    const BASE_URL = "https://wallet-demo-435v2.ondigitalocean.app/";
  
    const res = await fetch(`${BASE_URL}user-wallet/v1/gaming/transactions/credit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        transaction: {
          provider: "Hogamba",
          customer: {
            id: customerId,
            token,
            session_id: sessionId,
          },
          game_id: "hogamba_mines",
          spin_id: `spin_1234`,
          external_id: `external_1234`,
          amount: amount * 100,
          currency: "EUR"
        },
        jackpot: false
      })
    });
  
    const data = await res.json();

    if (data.status?.error) throw new Error(data.status.error_message);
    return data.balance / 100;
  }