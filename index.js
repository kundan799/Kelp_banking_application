const { Command } = require("commander");
const program = new Command();
const fs = require("fs");

// menu
console.log("🙏 Welcome To Banking App 🙏");

program
  .argument("<user>", "user details")
  .argument("[accountnumber]", "Account Number")
  .argument("[holdername]", "Account Number")
  .action(function (user, accountnumber, holdername) {
    let data = fs.readFileSync("./db.json", { encoding: "utf-8" });
    let userData = JSON.parse(data);
    // --------------------------------Account Create-------------------------------------
    if (user === "CREATE") {
      let object = {
        accountNumber: accountnumber,
        AcountHoldername: holdername,
        AccountBalance: 0,
        id: userData.UerDetails.length + 1,
      };

      // -----------------------------check acoount already exist or not -------------------------

      let current = userData.UerDetails.filter((e) => {
        if (
          e.accountnumber === accountnumber ||
          e.AcountHoldername === holdername
        ) {
          return e;
        }
      });
      if (current.length > 0) {
        console.log(
          "Create Account using different number this account number already exist"
        );
        return;
      }
      userData.UerDetails.push(object);
      let newData = JSON.stringify(userData);
      fs.writeFileSync("./db.json", newData, { encoding: "utf-8" });
      return;
    }

    // ----------------------------Deposite money--------------------------------
    if (user === "DEPOSIT") {
      holdername = parseInt(holdername);
      let current = userData.UerDetails.filter((e) => {
        if (e.accountNumber === accountnumber) {
          return e;
        }
      }).map((e) => {
        if (!Number.isNaN(holdername) && holdername > 0) {
          return {
            ...e,
            AccountBalance: parseInt(e.AccountBalance) + holdername,
          };
        } else {
          console.log("Account Number is wrong please enter write one");
          return e;
        }
      });

      if (current.length === 0) {
        console.log("Account Number is wrong");
        return;
      } else {
        let updatedData = userData.UerDetails.map((e) => {
          if (e.id === current[0].id) {
            return (e = current[0]);
          } else {
            return e;
          }
        });
        userData.UerDetails = updatedData;
        let newwData = JSON.stringify(userData);
        fs.writeFileSync("./db.json", newwData, { encoding: "utf-8" });
      }
      return;
    }
    // ------------------------withdrow money--------------------------------------------
    if (user === "WITHDRAW") {
      holdername = parseInt(holdername);

      let current = userData.UerDetails.filter((e) => {
        if (e.accountNumber === accountnumber) {
          return e;
        }
      }).map((e) => {
        if (
          e.AccountBalance > 0 &&
          !Number.isNaN(holdername) &&
          e.AccountBalance >= holdername
        ) {
          return {
            ...e,
            AccountBalance: parseInt(e.AccountBalance) - holdername,
          };
        } else {
          console.log("Insufficent Balance!");
          return e;
        }
      });

      if (current.length === 0) {
        console.log("Account Number is wrong please enter write one!");
        return;
      } else {
        let updatedData = userData.UerDetails.map((e) => {
          if (e.id === current[0].id) {
            return (e = current[0]);
          } else {
            return e;
          }
        });
        userData.UerDetails = updatedData;
        let newwData = JSON.stringify(userData);
        fs.writeFileSync("./db.json", newwData, { encoding: "utf-8" });
      }
      return;
    }
    // -----------------------------------------user account balance----------------------------------
    if (user === "BALANCE") {
      userData.UerDetails.filter((e) => {
        if (e.accountNumber === accountnumber) {
          console.log(e.AcountHoldername + " " + e.AccountBalance);
        }
      });
      return;
    }
  });
program.parse(process.argv);
