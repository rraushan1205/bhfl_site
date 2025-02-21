export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Handle GET request
  if (req.method === 'GET') {
    return res.status(200).json({
      operation_code: 1
    });
  }

  // Handle POST request
  if (req.method === 'POST') {
    try {
      const { data } = req.body;

      // Input validation
      if (!Array.isArray(data)) {
        return res.status(400).json({
          is_success: false,
          error: "Invalid input: 'data' must be an array"
        });
      }

      // Custom data processing logic
      const processedData = {
        numbers: [],
        alphabets: [],
        highest_alphabet: []
      };

      // Process each item in the array
      data.forEach(item => {
        const strItem = String(item);
        if (/^\d+$/.test(strItem)) {
          processedData.numbers.push(strItem);
        } else if (/^[A-Za-z]$/.test(strItem)) {
          processedData.alphabets.push(strItem);
        }
      });

      // Find highest alphabet using custom logic
      if (processedData.alphabets.length > 0) {
        const highest = processedData.alphabets.reduce((max, curr) => 
          curr.toLowerCase() > max.toLowerCase() ? curr : max
        );
        processedData.highest_alphabet = [highest];
      }

      // Your custom user details
      const userDetails = {
        user_id: "raushan12072005", // Replace with your details
        email: "raushanraj1205@gmail.com", // Replace with your email
        roll_number: "22bcs10230" // Replace with your roll number
      };

      return res.status(200).json({
        is_success: true,
        ...userDetails,
        ...processedData
      });

    } catch (error) {
      console.error('Error processing request:', error);
      return res.status(500).json({
        is_success: false,
        error: "Internal server error"
      });
    }
  }

  // Handle unsupported methods
  return res.status(405).json({
    is_success: false,
    error: "Method not allowed"
  });
}