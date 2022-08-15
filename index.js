import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";

const Answer = 24;
let playerName = "";
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

async function GenNumber() {
    let List = new Set([getRandomInt(1, 9), getRandomInt(1, 9), getRandomInt(1, 9), getRandomInt(1, 9)]);
    return List;
};

async function welcome() {
    const rainbowTitle = chalkAnimation.rainbow("ยินดีตอนรับเข้าสู่เกมส์ 24");
  
    await sleep();
    rainbowTitle.stop();
  
    console.log(`
      ${chalk.bgBlue("วิธีเล่น")} 
      ผู้เล่นจะได้รับเลข 4 จำนวน ซึ่งมีค่าตั้งแต่ 1 ถึง 9 (ห้ามเป็นเลข 0 แต่เป็นเลข 10,20 ฯลฯ ได้) 
      และจะต้องใช้การบวก, ลบ, คูณ หรือหารเพื่อให้ได้ค่าเป็น 24

      ${chalk.bgBlue("มาเริ่มเกมกันเถอะ!")}
  
    `);
};

async function askName() {
    const answers = await inquirer.prompt({
      name: "response",
      type: "input",
      message: "คุณชื่ออะไร?",
      default() { return "นิรนาม"}
    });
  
    playerName = answers.response;
    await sleep();
    let spinner = createSpinner('กำลังลงทะเบียน...').start();
    await sleep();
    await spinner.success({ text : `ลงทะเบียนเสร็จสิ้น! ขอให้โชคดี!` });
};

async function winner() {
    if (restartProcessVar) return;
    figlet(`Congrats!, ${playerName} You Win This Game!`, (err, data) => {
      console.log(gradient.pastel.multiline(data) + '\n')
      console.log(chalk.green(`ชัยชนะที่ได้มาด้วยความพยายามนั้น... อา~ ช่างมันเถอะ ขี้เกียจคิดแล้ว`));
      // console.log(chalk.green(`ชัยชนะที่ได้มาด้วยความพยายาม นั้นสำคัญกว่าใด และใช่ Millennium Prize Problems รอให้คุณแก้อยู่!`));
    });
    await sleep(5000);
    restartProcess();
};

async function makeQuestion() {
    
}

async function handleAnswer(isCorrect) {
    const spinner = createSpinner('กำลังตรวจสอบคำตอบ...').start();
    await sleep();
  
    if (isCorrect) {
      spinner.success({ text: `เป็นคำตอบที่ถูกต้องแล้วครับ!` });
      playerScore = playerScore + countAddPoint;
      await inquirer.prompt({
        name: "response",
        message: `คุณ ${playerName} คุณต้องการไปต่อใช่หรือไม่`,
        type: "confirm"
      }).then((answers) => {
        if (!answers.response) {
          spinner.success({ text: `คะแนนของคุณ ${playerName} ตอนนี้คือ ${playerScore} โอกาสหน้าเชิญใหม่นะครับ.` })
          restartProcess();
        }
      })
    } else {
      spinner.error({ text: `คำตอบยังไม่ถูกต้องนะครับ คุณ ${playerName} คะแนนสูงสุดของคุณคือ ${playerScore} โอกาสหน้าลองใหม่!` });
      restartProcess();
    }
};


async function startGame() {
    await welcome();
    await askName();
}

startGame();