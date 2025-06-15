import axios from "axios";


const CLIENT_ID =
  'AZOmOqMn-cZwFN1VqfLd56SudIXu5rp22rvg6d3SyR3wB0Ud_jkDT8Y2XvLdzKeuhwLtxEkpCJxo7-zh';
const CLIENT_SECRET =
  'ENvP_VIvVDPDXnII_rZRDTHV5HtS6zWboKUCZiv_PrNF1rP2iuqS_rplComzimYabkOAT81B_g1XuFC7';
// const BASE_URL = 'https://api-m.sandbox.paypal.com'; // use live endpoint for production
export const BASE_URL = 'https://sandbox.paypal.com'; // use live endpoint for production



export async function getPaypalAccessToken() {
  const response = await axios.post(
    `${BASE_URL}/v1/oauth2/token`,
    'grant_type=client_credentials',
    {
      auth: {
        username: CLIENT_ID,
        password: CLIENT_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  );

  return response.data.access_token;
}
