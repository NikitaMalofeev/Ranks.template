const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'pages', 'AdminPage', 'AdminPage.tsx');
let content = fs.readFileSync(filePath, 'utf8');

// Замены английских терминов на русские
const replacements = [
  // Статистические термины
  { from: 'Win Rate', to: 'Успешность' },
  { from: 'Profit Factor', to: 'Фактор прибыли' },
  { from: 'Sharpe Ratio', to: 'Коэф. Шарпа' },
  { from: 'Max Drawdown', to: 'Макс. просадка' },
  { from: 'AUM', to: 'АПУ' },
  { from: 'KPI', to: 'КПЭ' },
  { from: 'Volatility', to: 'Волатильность' },
  { from: 'Sortino Ratio', to: 'Коэф. Сортино' },
  { from: 'Calmar Ratio', to: 'Коэф. Калмара' },
  { from: 'YTD', to: 'С начала года' },
  { from: 'Senior Trader', to: 'Старший трейдер' },
  { from: 'Real-time', to: 'В реальном времени' },
];

replacements.forEach(({ from, to }) => {
  const regex = new RegExp(from, 'g');
  content = content.replace(regex, to);
});

fs.writeFileSync(filePath, content, 'utf8');
console.log('✓ Все английские названия заменены на русские');
