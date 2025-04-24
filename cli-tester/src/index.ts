import inquirer from 'inquirer';
import axios from 'axios';
import chalk from 'chalk';

const GATEWAY = process.env.GATEWAY_URL || 'http://localhost:3000';

async function main() {
  console.clear();
  console.log(chalk.blue.bold('🔐 2FA CLI Tester'));

  // 1) Ask whether to enroll or login
  const { action } = await inquirer.prompt({
    name: 'action',
    type: 'list',
    message: 'What do you want to do?',
    choices: ['Enroll user', 'Login & Profile'],
  });

  // common prompt for username
  const { username } = await inquirer.prompt({
    name: 'username',
    type: 'input',
    message: 'Username:',
    default: 'alice',
  });

  if (action === 'Enroll user') {
    // 2) Enroll
    try {
      const { data } = await axios.get(`${GATEWAY}/2fa/enroll/${username}`);
      console.log(chalk.green('Secret:'), data.secret);
      console.log(chalk.green('QR URI:'), data.qr_uri);
    } catch (e: any) {
      console.error(chalk.red('Enroll failed:'), e.response?.data || e.message);
    }
    return;
  }

  // 3) Login & Profile
  const answers = await inquirer.prompt([
    { name: 'password', type: 'password', message: 'Password:' },
    { name: 'code', type: 'input',     message: '2FA Code:'  },
  ]);

  try {
    // 4) Login
    const loginResp = await axios.post(`${GATEWAY}/login`, {
      username,
      password: answers.password,
      code:     answers.code,
    });
    const token = loginResp.data.token;
    console.log(chalk.green('✅  Login successful!'));
    console.log(chalk.yellow('Token:'), token);

    // 5) Fetch profile
    const profileResp = await axios.get(`${GATEWAY}/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(chalk.cyan('🧑 Profile:'), profileResp.data);
  } catch (e: any) {
    console.error(chalk.red('Error:'), e.response?.data || e.message);
  }
}

main();
