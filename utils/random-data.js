const axios = require('axios');
const RANDOM_DATA_URL = 'https://random-data-api.com/api/v2/';
module.exports = {

    fetchRandomCreditCards: async (size = 20) => {
        try {
            const response = await axios.get(
                `${RANDOM_DATA_URL}/credit_cards?size=${size}`
            );

            // Filter visa cards
            let visaCards = response.data.filter(item => item.credit_card_type === 'visa');

            // mask the credit card number
            visaCards = visaCards.map(item => {
                return {
                    ...item,
                    credit_card_number: 'XXXX-XXXX-XXXX-XXXX',
                }
            });

            return visaCards;
        } catch (exception) {
            return null;
        }

    }
}