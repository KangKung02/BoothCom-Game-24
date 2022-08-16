import chalk from "chalk";
import inquirer from "inquirer";
import gradient from "gradient-string";
import chalkAnimation from "chalk-animation";
import figlet from "figlet";
import { createSpinner } from "nanospinner";

let restartProcessVar;
const Answer = 24;
let playerName = "";
let playerScore = 0;
let Article = 1;
const sleep = (ms = 2000) => new Promise((r) => setTimeout(r, ms));

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
};

async function GenNumber() {
    return `[${getRandomInt(1, 9)}, ${getRandomInt(1, 9)}, ${getRandomInt(1, 9)}, ${getRandomInt(1, 9)}]`;
};

async function restartProcess() {
  restartProcessVar = true;
  playerName;
  playerScore = 0;

  const answers = await inquirer.prompt({
    name: "response",
    type: "confirm",
    message: `ต้องการเริ่มใหม่ใช่หรือไม่?`
  });

  if (!answers.response) { console.log("ไม่ละ จงอยู่กับ Loop นรกนี้ไปซะ!") };
  const spinner = createSpinner('กำลังเริ่มต้นเกมใหม่ อีกครั้ง...').start();
  await sleep();
  spinner.success({ text: "เสร็จสิ้น" });
  restartProcessVar = false;
  await sleep();
  console.clear();
  startGame();
}

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
  const spinner = createSpinner('กำลังสร้างโจทย์...').start();
  await sleep(1000);
  spinner.success({ text: `เสร็จสิ้น!` });
  const genNumber = await GenNumber();
  const answers = await inquirer.prompt({
    name: "response",
    type: "input",
    message: `ข้อที่ ${Article}). โจทย์คือ ${genNumber.toString()}
    คำตอบ :`
  });

  try {
    return await handleAnswer(eval(answers.response.replace(/[^-()\d/*+.]/g, '')) == Answer, answers.response, genNumber);
  } catch (Err) {
    console.log(`Error : ${Err}`);
  };
};

async function checkUsingString(Using, Allowed) {
  let check;
  let usingList = Using.match(/\d+/g);
  let allowedList = Allowed.match(/\d+/g);
  await allowedList.forEach((Value) => {
    if (!usingList.includes(Value)) { check = true };
  });
  await usingList.forEach((Value) => {
    if (!allowedList.includes(Value)) { check = true };
  });

  return !check;
}
async function handleAnswer(isCorrect, usingNumber, genNumber) {
    const spinner = createSpinner('กำลังตรวจสอบคำตอบ...').start();
    await sleep();
    let Returning;
    if (isCorrect && await checkUsingString(usingNumber, genNumber)) {
      playerScore = playerScore + 1;
      Article = Article + 1;
      spinner.success({ text: `เป็นคำตอบที่ถูกต้องแล้วครับ!, ตอนนี้คะแนนของคูณคือ ${playerScore}` });
      await inquirer.prompt({
        name: "response",
        message: `คุณ ${playerName} คุณต้องการไปต่อใช่หรือไม่`,
        type: "confirm"
      }).then((answers) => {
        if (!answers.response) {
          spinner.success({ text: `คะแนนของคุณ ${playerName} ตอนนี้คือ ${playerScore} โอกาสหน้าเชิญใหม่นะครับ.` })
          restartProcess();
        } else {
          Returning = true;
        };
      })
    } else {
      spinner.error({ text: `คำตอบยังไม่ถูกต้องนะครับ คุณ ${playerName} คะแนนสูงสุดของคุณคือ ${playerScore} โอกาสหน้าลองใหม่!` });
      restartProcess();
    }
    return Returning;
};


async function startGame() {
    await welcome();
    await askName();
    let check = true;
    while (true) {
      let response = await makeQuestion();
      if (!response) break;
    };
}

startGame();