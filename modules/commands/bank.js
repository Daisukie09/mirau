exports.config = {
    name: 'bank',
    version: '0.0.1',
    hasPermssion: 0,
    credits: 'DC-Nam',
    description: 'banking',
    commandCategory: 'User',
    usages: '[]',
    cooldowns: 0,
};
let fs = require('fs');
let folder = __dirname+'/data/banking_accounts/'; if (!fs.existsSync(folder))fs.mkdirSync(folder);
let read = (id, path = folder+id+'.json')=>fs.existsSync(path)?JSON.parse(fs.readFileSync(path)): null;
let reads = _=>fs.readdirSync(folder).map($=>read($.replace('.json', ''))).filter($=>$ != null);
let del = (id, path = folder+id+'.json')=>fs.unlinkSync(path);
let acc_my_login = id=>reads().find($=>$.logins.some($=>$.uid == id)) || null;
let save = (data, path = folder+data.uid+'.json')=>fs.writeFileSync(path, JSON.stringify(data, 0, 4));
let _0 = t=>t < 10?'0'+t: t;
let convert_time = (time, format)=>require('moment-timezone')(time).format(format || 'HH:mm:ss DD/MM/YYYY');
let now = ()=>Date.now()+25200000;
let random_number = (min, max)=>Math.floor(Math.random() * (max - min + 1)) + min;
let random_str = l=>[...Array(l)].map($=>'0123456789'[Math.random()*10<<0]).join('');
let name = id=>global.data.userName.get(id);
let _2fa_ = {};
let create_code_2fa = id=>(_2fa_[id] = random_str(6), setTimeout(_=>delete _2fa_[id], 1000*60*3), `📝 Auth code: ${_2fa_[id]}\nCode is valid for 3 minutes`);
let check_code_2fa = (id, code)=>_2fa_[id] == code;
let interest = {
    debt: {
        rate: BigInt('5'),
        time: 1000*60*60,
    },
    balance: {
        rate: BigInt('1'),
        time: 1000*60*60*24*1,
    },
};
let _1th = 1000*60*60*24*30;
let ban_millis = _1th;
let due_millis = 1000*60*60*24*2;
exports.onLoad = o=> {
    if (!global.set_interval_bankings_interest_p)global.set_interval_bankings_interest_p = setInterval((()=> {
        for (let file of reads()) {
            let send = msg=>new Promise(r=>o.api.sendMessage(msg, file.uid, (err, res)=>r(res || err)));
            if (typeof file.timestamp_due_repay != 'number' && BigInt(file.debt) > 0n)(file.timestamp_due_repay = now() + due_millis, save(file));
            if (typeof file.expired_ban.time == 'number' && now() > file.expired_ban.time)(file.expired_ban = {}, save(file));
            if (typeof file.expired_ban.time != 'number' && typeof file.timestamp_due_repay == 'number' && now() > file.timestamp_due_repay && BigInt(file.debt) > 0n)(file.expired_ban.time = now() + ban_millis, file.expired_ban.reason = `Over ${due_millis/1000/60/60/24<<0} days without paying off debt`, save(file), send(`[ OVERDUE NOTICE ]\n\n⚠️ Since you haven't paid your debt within ${due_millis/1000/60/60/24<<0} days, your account has been locked for ${ban_millis/1000/60/60/24/30<<0} months. Contact Admin for resolution.`));
            if (typeof file.expired_ban.time != 'number') for (let type of ['balance', 'debt']) {
                if (BigInt(file[type]) >= 100n && (typeof file.interest_period[type]) != 'number')(file.interest_period[type] = now() + interest[type].time, save(file));
                if (typeof file.interest_period[type] == 'number' && now() > file.interest_period[type] && BigInt(file[type]) >= 100n)(interest_money = BigInt(file[type]) * interest[type].rate / 100n, file[type] = (BigInt(file[type]) + interest_money).toString(), file.interest_period[type] = now() + interest[type].time, save(file), send(`[ INTEREST NOTICE ]\n\n+ ${interest_money.toLocaleString()}$ interest added to ${ {
                    balance: 'balance', debt: 'debt'
                }[type]}`));
            };
        };
    }), 1000);
};
exports.run = async o=> {
    let tid = o.event.threadID;
    let send = (msg, tid_, typ = typeof tid_ == 'object')=>new Promise(r=>(o.api.sendMessage(msg, typ?tid_.event.threadID: (tid_ || tid), (err, res)=>r(res || err), typ?tid_.event.messageID: (tid_?undefined: o.event.messageID))));
    let cmd = o.event.args[0];
    let sid = o.event.senderID;
    let target_id = o.event.messageReply?.senderID || Object.keys(o.event.mentions || {})[0];
    let data = read(sid);
    let {
        getData,
        increaseMoney,
        decreaseMoney,
    } = o.Currencies;
    //if (convert_time(now(), 'd') == '0')return send('⛔ Sunday banking is closed, see you again');
    if (acc_my_login(sid))data = acc_my_login(sid);
    if (!!o.args[0] && !['-r', 'register', 'login', 'unban'].includes(o.args[0]) && data == null)return send(`❎ You don't have a bank account yet, use '${cmd} register' to sign up`);
    if (!!o.args[0] && !['unban', 'login', 'logout'].includes(o.args[0]) && typeof data?.expired_ban?.time == 'number')return send(`❎ Your account has been banned because: ${data.expired_ban.reason}, ban will be lifted in: ${(d=>`${_0(d/1000/60/60/24%30<<0)} days ${_0(d/1000/60/60%24<<0)}:${_0(d/1000/60%60<<0)}:${_0(d/1000%60<<0)}`)(data.expired_ban.time - now())}`);
    switch (o.args[0]) {
        case '-r':
        case 'register': {
                let account_number;
                let phí = 100000000n;
                if (data)return send('❎ You already have an account');
                let create_account = pass=> {
                    if (read(sid) != null)return send('❎ You already have an account', sid);
                    let form = {
                        "account_number": account_number || random_str(6),
                        "uid": sid,
                        "balance": "0",
                        "created_at": now(),
                        "debt": "0",
                        "count_debt": 0,
                        "status": 0,
                        "history": [],
                        "logins": [],
                        "settings": {},
                        "expired_ban": {},
                        "interest_period": {},
                        pass,
                    };
                    save(form);
                    return send(`✅ Bank account created successfully, use '${cmd} info' to view account info`, sid);
                };
                send(`🆕 Do you want to set your own account number? Reply to this message with the desired account number (fee ${phí.toLocaleString()}$) or 'n' to skip`).then(res=>(res.name = exports.config.name, res.callback = async o=> {
                    let stk = o.event.args[0];
                    if (isFinite(stk)) {
                        if (reads().some($=>$.account_number == stk))return send(`❎ Account number already exists`, o);
                        if (BigInt((await getData(sid)).money) < phí)return send("❎ You don't have enough money", o);
                        account_number = stk;
                        decreaseMoney(sid, phí.toString());
                    };
                    send(`📌 Do you want to set your own account password or let the system generate a random one?\n\nReply 'y' to set your own or 'n' for system random`, o).then(res=>(res.name = exports.config.name, res.callback = async o=> {
                        let call = {
                            y: _=>send('✅ The system has sent the password entry step via private message', o).then(()=>send('📌 Reply to this message to enter your desired password', o.event.senderID).then(res=>(res.name = exports.config.name, res.callback = o=>create_account(o.event.args[0]), res.o = o, global.client.handleReply.push(res)))),
                            n: _=>send('✅ The system has sent the password via private message', o).then(_=>create_account(random_str(4)).then(()=>send(`📌 Your password is ${read(sid).pass}`, sid))),
                        }[(o.event.args[0] || '').toLowerCase()];
                        if (read(sid) != null)return send('❎ You already have an account', o);
                        if (!call)return send('❎ Please reply y/n', o); else call();
                    },
                        res.o = o,
                        global.client.handleReply.push(res)));
                }, res.o = o, global.client.handleReply.push(res)));
            };
            break;
        case '-i':
        case 'info': try {
                let acc = o.args[1]?.split(':') || [];
                let data_target = !!target_id?read(target_id): acc.length != 0?(acc[0] == 'uid'?read(acc[1]): acc[0] == 'stk'?reads().find($=>$.account_number == acc[1]) || null: null): data;
                if (data_target == null)return send('❎ Could not find the account to view info');
                if ((!!target_id || acc.length != 0) && !data_target.settings.public)return send('⚠️ This account does not have public information');
                send(`[ MIRAI BANK ]\n\n👤 Account holder: ${name(data_target.uid)?.toUpperCase()}\n🏦 STK: ${data_target.account_number}\n💵 Balance: ${BigInt(data_target.balance).toLocaleString()}$ ${!!data_target.interest_period.balance && BigInt(data_target.balance) > 100n?`\n⬆️ Interest: +${(BigInt(data_target.balance) * interest.balance.rate / 100n).toLocaleString()}$ after ${(f=>`${_0(f/1000/60/60<<0)}:${_0(f/1000/60%60<<0)}:${_0(f/1000%60<<0)}`)(data_target.interest_period.balance - now())}`: ''}\n🔄 Security status: ${data_target.pass.length <= 4 && !data_target.settings._2fa?'weak (short pass, no 2fa)': data_target.pass.length > 4 && !!data_target.settings._2fa?`Strong`: `fair (${data_target.pass.length <= 4?'short pass': 'no 2fa'})`}\n🔒 Global Ban: ${data_target.expired_ban.time?`banned at ${convert_time(data_target.expired_ban.time- _1th)} reason: ${data_target.expired_ban.reason}`: 'not banned'}\n⏰ Created: ${convert_time(data_target.created_at)}\n⛔ Debt: ${BigInt(data_target.debt).toLocaleString()}$ ${!!data_target.interest_period.debt && BigInt(data_target.debt) > 100n?`\n⬆️ Interest: +${(BigInt(data_target.debt) * interest.debt.rate / 100n).toLocaleString()}$ after ${(f=>`${_0(f/1000/60/60<<0)}:${_0(f/1000/60%60<<0)}:${_0(f/1000%60<<0)}`)(data_target.interest_period.debt - now())}`: ''}\n🌐 Public info: ${!data_target.settings.public?'no': 'yes'}\n🔢 2-factor auth: ${!data_target.settings._2fa?'off': 'on'}\n\n📌 Balance/debt over 100$ will start earning interest`);
            } catch(e) {
                console.log(e);
                send('⚠️ An error occurred, contact the dev for support');
            };
            break;
        case 'nạp':
        case 'gửi': {
                let money = o.args[1];
                let min = 100n;
                let userData = await getData(sid);
                if (/^all$/.test(money))money = BigInt(userData.money);
                else if (/^[0-9]+%$/.test(money))money = BigInt(userData.money)*BigInt(money.match(/^[0-9]+/)[0])/100n;
                if (!money || isNaN(money.toString())) return send(`❎ Please enter the amount to deposit into your account`); else money = BigInt(money);
                if (money < min) return send(`❎ Minimum deposit is ${min.toLocaleString()}$`);
                if (BigInt(userData.money) < money) return send(`❎ You don't have enough money in your wallet to deposit into the account`);
                let newBalance = BigInt(data.balance) + money;

                await decreaseMoney(sid, money.toString());
                data.balance = newBalance.toString();
                data.history.push({
                    type: 'send', amount: money.toString(), author: sid, time: now(),
                });
                save(data);
                send(`✅ Deposited ${money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}$ into account successfully`);
            };
            break;
        case 'rút':
        case 'lấy': {
                let money = o.args[1];
                let min = 1n;
                if (/^all$/.test(money))money = BigInt(data.balance);
                else if (/^[0-9]+%$/.test(money))money = BigInt(data.balance)*BigInt(money.match(/^[0-9]+/)[0])/100n;
                if (isNaN(money+'')) return send(`❎ Please enter the amount to withdraw from your account`); else money = BigInt(money);
                if (money < min) return send(`❎ Minimum withdrawal is ${min.toLocaleString()}$`);
                if (money > BigInt(data.balance)) return send(`❎ You don't have enough money`);
                let newBalance = BigInt(data.balance) - money;
                let userData = await getData(sid);
                let newMoney = BigInt(userData.money) + money;
                await increaseMoney(sid, money.toString());
                data.balance = newBalance.toString();
                data.history.push({
                    type: 'withdraw', amount: money.toString(), author: sid, time: now()});
                save(data);
                send(`✅ Withdrew ${money.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")}$ from account successfully`);
            };
            break;
        case '-t':
        case 'top': {
                if (BigInt(data.balance) < 100000)return send('❎ Your bank account balance must be greater than 100,000$ to view the leaderboard');
                send('📌 React to confirm -10% fee to check the banking leaderboard').then(res=>(res.callback = ()=>(data.balance = (BigInt(data.balance) - BigInt(data.balance) * 10n / 100n).toString(), save(data), send(`[ TOP LEADERBOARD ]\n\n${reads().sort((a, b)=>BigInt(b.balance) < BigInt(a.balance)?-1: 0).slice(0, 10).map(($, i)=>`📊 Top: ${i+1}\n👤 Name: ${$.settings.public?name($.uid)?.toUpperCase(): 'not public'}\n💵 Money: ${BigInt($.balance).toLocaleString()}$`).join('\n\n')}`)), res.name = exports.config.name, res.o = o, global.client.handleReaction.push(res)));
            };
            break;
        case '-p':
        case 'pay': {
                let type_pay = (o.args[1] || '').toLowerCase();
                if (!['stk', 'uid'].includes(type_pay))return send(`❎ Please choose 'stk' or 'uid'\nEx: ${cmd} pay stk`);
                send(`📌 Reply to this message with the ${ {
                    stk: 'account number', uid: 'Facebook uid'
                }[type_pay]} of the person to transfer money to`).then(res=>(res.name = exports.config.name, res.o = o, res.callback = async o=> {
                        let send = (msg, tid)=>new Promise(r=>(o.api.sendMessage(msg, tid || o.event.threadID, (err, res)=>r(res || err), tid?undefined: o.event.messageID)));
                        let target_pay = o.event.args[0];
                        let receiver = type_pay == 'stk'?reads().find($=>$.account_number == target_pay) || null: read(target_pay);
                        if (!receiver)return send(`⚠️ The target account does not exist`);
                        send(`👤 Name: ${name(receiver.uid)?.toUpperCase()}\n🏦 Account: ${receiver.account_number}\n\n📌 Reply with the amount to transfer`).then(res=>(res.name = exports.config.name, res.o = o, res.callback = async o=> {
                            data = read(data.uid);
                            let send = (msg, tid)=>new Promise(r=>(o.api.sendMessage(msg, tid || o.event.threadID, (err, res)=>r(res || err), tid?undefined: o.event.messageID)));
                            let money_pay = (o.event.args[0] || '').toLowerCase();
                            if (money_pay == 'all')money_pay = data.balance.toString();
                            else if (/^[0-9]+%$/.test(money_pay))money_pay = BigInt(data.balance)*BigInt(money_pay.match(/^[0-9]+/)[0])/100n;
                            if (isNaN(money_pay.toString()))return send('❎ Invalid amount');
                            if (BigInt(money_pay) < 500n)return send(`❎ Minimum transfer amount is 500$`);
                            if (BigInt(money_pay) > BigInt(data.balance))return send(`❎ You don't have enough money to transfer`);
                            send('📌 Reply with transfer content').then(res=>(res.name = exports.config.name, res.o = o, res.callback = async o=> {
                                let send = (msg, tid)=>new Promise(r=>(o.api.sendMessage(msg, tid || o.event.threadID, (err, res)=>r(res || err), tid?undefined: o.event.messageID)));
                                let content_pay = o.event.body;
                                send(`👤 Name: ${name(receiver.uid)?.toUpperCase()}\n🏦 Account: ${receiver.account_number}\n💵 Amount to transfer: ${BigInt(money_pay).toLocaleString()}$\n📝 Transfer note: ${content_pay}\n\n📌 React to confirm the transfer`).then(res=>(res.name = exports.config.name, res.o = o, res.callback = async o=> {
                                    data = read(data.uid);
                                    receiver = read(receiver.uid);
                                    let newBalance = BigInt(data.balance) - BigInt(money_pay);
                                    let newReceiverBalance = BigInt(receiver.balance) + BigInt(money_pay);
                                    data.balance = newBalance.toString();
                                    receiver.balance = newReceiverBalance.toString();
                                    data.history.push({
                                        type: 'pay', amount: money_pay.toString(), content: content_pay, author: sid, time: now(), to: receiver.account_number
                                    });
                                    receiver.history.push({
                                        type: 'receive', amount: money_pay.toString(), content: content_pay, time: now(), from: data.account_number
                                    });
                                    save(data);
                                    save(receiver);
                                    await send(`[ MONEY RECEIVED ]\n\n👤 Name: ${name(data.uid).toUpperCase()}\n🏦 Account: ${data.account_number}\n💵 Amount: ${BigInt(money_pay).toLocaleString()}$\n📝 Content: ${content_pay}\n\n📌 Your balance is: ${newReceiverBalance.toLocaleString()}$`, receiver.uid);
                                    send(`✅ Transferred ${BigInt(money_pay).toLocaleString()}$ to ${name(receiver.uid)} successfully`, tid);
                                }, global.client.handleReaction.push(res)))
                            }, global.client.handleReply.push(res)))
                        },
                            global.client.handleReply.push(res)))
                    }, global.client.handleReply.push(res)));
            };
            break;
        case '-v':
        case 'vay': {
                let limit = 10000000n;
                let money = o.args[1];
                if (money === 'max')money = limit;
                if (isNaN(money+'')) return send(`❎ Please enter the amount you want to borrow`);
                if (BigInt(money) < 500n) return send(`❎ Minimum loan amount is 500$`);
                if (data.count_debt >= 2) return send(`❎ You have an outstanding debt, please repay before borrowing`);
                if (o.args[1] === 'max')money = limit - BigInt(data.debt);
                let newDebt = BigInt(data.debt) + BigInt(money); if (newDebt > limit || money == 0n)return send(`❎ The maximum loan limit for your account is ${limit.toLocaleString()}$`);
                let newBalance = BigInt(data.balance) + BigInt(money);
                data.balance = newBalance.toString();
                data.debt = newDebt.toString();
                data.count_debt++;
                data.history.push({
                    type: 'borrow', amount: money.toString(), author: sid, time: now()});
                if (!data.timestamp_due_repay)data.timestamp_due_repay = now()+ due_millis;
                save(data);
                send(`✅ Borrowed ${BigInt(money).toLocaleString()}$ successfully, you now have a debt of ${newDebt.toLocaleString()}$ with an interest rate of ${interest.debt.rate}%/${interest.debt.time/1000/60/60<<0} hours. After ${due_millis/1000/60/60/24<<0} days without full repayment, your account will be locked for 1 month`);
            };
            break;
        case 'trả': {
            let money = o.args[1];
            if (data.debt == '0')return send('⚠️ You have no outstanding debt');
            if (/^all$/.test(money))money = data.debt;
            if (isNaN(money+'')) return send(`❎ Please enter the amount to repay towards your debt`);
            if (BigInt(money) > BigInt(data.balance))return send('⚠️ Insufficient balance to repay');
            if (BigInt(money) > BigInt(data.debt) || BigInt(money) < 1n) return send(`❎ Repayment amount cannot exceed current debt/be less than 1$ or you can use '${cmd} trả all' to pay off all debt`);
            let newDebt = BigInt(data.debt) - BigInt(money);
            let newBalance = BigInt(data.balance) - BigInt(money);
            data.balance = newBalance.toString();
            data.debt = newDebt.toString();
            if (data.debt == '0')(data.count_debt = 0, delete data.timestamp_due_repay);
            data.history.push({
                type: 'repay', amount: money.toString(), author: sid, time: now()});
            save(data);
            send(`✅ Repaid ${BigInt(money).toLocaleString()}$ successfully, current debt is ${newDebt.toLocaleString()}$${newDebt != 0n?`, repayment deadline has been reset to ${due_millis/1000/60/60/24<<0} days`: ''}`);
        };
            break;
        case '-h':
        case 'history':
            send(`[ TRANSACTION HISTORY ]\n\n${data.history.map(($, i)=>(money_str = $.amount?`${BigInt($.amount).toLocaleString()}$`: '', `${i+1}. ${convert_time($.time)} - ${ {
                send: _=>`deposit ${money_str}`,
                withdraw: _=>`withdraw ${money_str}`,
                pay: _=>`transfer ${money_str} to account ${$.to}`,
                receive: _=>`received ${money_str} from account ${$.from}`,
                borrow: _=>`borrow ${money_str}`,
                repay: _=>`repay ${money_str}`,
                login: _=>`login by https://www.facebook.com/profile.php?id=${$.from}`,
                setpass: _=>`https://www.facebook.com/profile.php?id=${$.author} set password to: ${$.pass}`,
                setstk: _=>`https://www.facebook.com/profile.php?id=${$.author} changed account number to: ${$.stk}`,
            }[$.type]()}`)).join('\n\n')}`);
            break;
        case 'setpass':
            await send('✅ The system has sent the password entry step via private message');
            send('📌 Reply to this message to enter a new password', sid).then(res=>(res.callback = o=> {
                data.pass = o.event.args[0];
                data.history.push({
                    type: 'setpass', pass: data.pass, author: sid, time: now(),
                });
                save(data);
                send('✅ Password has been set for the account\nThis password can be used to log into your Banking account from another Facebook account', o);
            }, res.name = exports.config.name, res.o = o, global.client.handleReply.push(res)));
            break;
        case 'setstk': {
            let phí = 100000000n;
            if (isNaN(o.args[1]))return send('❎ Account number must be a number');
            if (BigInt(data.balance) < phí)return send(`❎ You don't have enough money, need ${phí.toLocaleString()}$`);
            send(`📌 React to confirm changing account number for a fee of ${phí.toLocaleString()}$`).then(res=>(res.callback = _=> {
                let newBalance = BigInt(data.balance) - phí;
                data.balance = newBalance.toString();
                data.account_number = o.args[1];
                data.history.push({
                    type: 'setstk', stk: o.args[1], author: sid, time: now(),
                });
                save(data);
                send(`✅ Account number changed successfully\nDeducted ${phí.toLocaleString()}$`);
            }, res.name = exports.config.name, res.o = o, global.client.handleReaction.push(res)));
        };
            break;
        case 'login': {
            let type = (o.args[1] || '').toLowerCase();

            if (!['uid', 'stk'].includes(type))return send(`❎ Please choose 'stk' or 'uid'\nEx: ${cmd} login stk`);
            await send('✅ The system has sent the login steps via private message');
            send(`📌 Reply to this message to enter ${ {
                uid: 'Facebook uid', stk: 'account number'
            }[type]}`, sid).then(res=>(res.callback = o=> {
                    let target_id = o.event.args[0];
                    let data_target = type == 'uid'?read(target_id): type == 'stk'?reads().find($=>$.account_number == target_id) || null: null;
                    if (data_target == null)return send('⚠️ The account you entered does not seem to exist', o);
                    if (data_target.uid == sid)return send('✅ Your Facebook is the owner of this account, so the system auto-logged in previously', o);
                    send('📌 Reply to this message to enter the password', o).then(res=>(res.callback = async o=> {
                        data_target = read(data_target.uid);
                        let pass = o.event.args[0];
                        if (data_target.pass != pass)return send('⚠️ Incorrect password', o);
                        let login = async o=> {
                            data_target.logins.push({
                                "uid": sid,
                                "time": now(),
                            });
                            data_target.history.push({
                                type: 'login', from: sid, time: now(),
                            });
                            save(data_target);
                            if (typeof data?.uid == 'string' && data?.uid != sid)(data.logins.splice(data.logins.findIndex($=>$.uid == sid), 1), save(data));
                            await send(`✅ Logged into banking account, use '${cmd} info' to view account info`);
                            send(`[ Banking - Notice ]\n\n⚠️ your account was just logged into from https://www.facebook.com/profile.php?id=${sid}\n⛔ if you don't recognize this person, change your password and react to this message to log them out immediately, or use ${cmd} logloca to see all logged-in locations and log them out.`, data_target.uid).then(res=>(res.callback = o=> {
                                data_target = read(data_target.uid);
                                data_target.logins.splice(data_target.logins.findIndex($=>$.uid == sid), 1);
                                save(data_target);
                                send(`✅ Logged out from https://www.facebook.com/profile.php?id=${sid}`, o);
                            }, res.name = exports.config.name, res.o = o, global.client.handleReaction.push(res)));
                        };
                        if (!data_target.settings._2fa)login(o);
                        else send(`🔒 Login verification code has been sent to the account owner's FB, reply to this message with the code to verify`, o).then(res=>(send(create_code_2fa(sid), data_target.uid), res.callback = async o=> {
                            let code = o.event.args[0];
                            if (!check_code_2fa(sid, code))return send('❎ Login code is incorrect');
                            login(o);
                        },
                            res.name = exports.config.name,
                            res.o = o,
                            global.client.handleReply.push(res)));
                    },
                        res.name = exports.config.name,
                        res.o = o,
                        global.client.handleReply.push(res)));
                }, res.name = exports.config.name, res.o = o, global.client.handleReply.push(res)));
        };
            break;
        case 'logout': {
            if (data == null || data?.uid == sid)return send(`❎ You are not logged into any account`);

            data.logins.splice(data.logins.findIndex($=>$.uid == sid), 1);
            save(data);
            send(`✅ Logged out of the account`);
        };
            break;
        case 'logloca':
            send(`[ Banking - Login Locations ]\n\n${data.logins.map(($, i)=>`${i+1}. https://www.facebook.com/profile.php?id=${$.uid} (${convert_time($.time)})`).join('\n')}\n\nReply with the number to log out of that Facebook login`).then(res=>(res.callback = o=> {
                let stt = o.event.args;
                if (isNaN(stt.join('')))return send(`❎ Number must be a digit`, o);
                data.logins = data.logins.filter((e, i)=>!stt.includes(''+(i+1)));
                save(data);
                send('✅ Logged out of the above Facebook', o)
            },
                res.o = o,
                res.name = exports.config.name,
                global.client.handleReply.push(res)));
            break;
        case 'delete': {
            if (data == null)return send(`⚠️ You don't have an account`);
            if (data.uid != sid)return send(`❎ Insufficient permissions to delete`);
            if (BigInt(data.debt) > 0n)return send("⚠️ Cannot process request because you haven't paid off your debt");
            let callback = ()=> {
                del(sid);
                send('✅ Account deleted');
            };
            send('📌 React to confirm account deletion\n\n⚠️ This cannot be undone').then(res=>(res.name = exports.config.name, res.callback = callback, res.o = o, res.type = 'cofirm_delete_account', global.client.handleReaction.push(res)));
        };
            break;
        case 'public': {
            if (!['on', 'off'].includes(o.args[1]))return send(`⚠️ Please try again using: ${cmd} public on or off`);
            data.settings.public = o.args[1] == 'on'?true: false;
            save(data);
            send(`✅ ${o.args[1] == 'on'?'Enabled': 'Disabled'} public account info`);
        };
            break;
        case '2fa': {
            if (!['on', 'off'].includes(o.args[1]))return send(`❎ Please enter ${cmd} 2fa on or off`);
            data.settings._2fa = o.args[1] == 'on'?true: false;
            save(data);
            send(`✅ ${o.args[1] == 'on'?'Enabled': 'Disabled'} 2fa`);
        };
            break;
        case 'unban': {
            if (!global.config.ADMINBOT.includes(sid))return;
            let data_target = read(target_id || o.args[1] || sid);
            if (data_target == null)return send('⚠️ Account not found');
            if (!data_target.expired_ban.time)return send('❎ Account is not banned');
            data_target.expired_ban = {};
            delete data_target.timestamp_due_repay;
            data_target.balance = '0';
            data_target.debt = '0';
            save(data_target);
            send('✅ Unbanned this account');
        };
            break;
        case 'admin':
            if (global.config.ADMINBOT.includes(sid))send(`[ Banking - Admin Commands ]\n\n1: 55 66 (delete file.json with 55 and 66 as fb ids).\n2: 88 1000 (change balance of ID 88 to 1000$)\n3: 88 1000 (change debt of ID 88 to 1000$)\n\n-> Reply with number [data]`).then(res=>(res.callback = async o=> {
                let call = {
                    1: _=>(o.event.args.map($=>del($)), send('done', o)),
                    //2: _=>(d = read(o.event.args))
                }[o.event.args[0]];
                call();
            }, res.name = exports.config.name, res.o = o, global.client.handleReply.push(res))); else break;
        break;
        default:
            send(`[ MIRAI BANK ]\n\n${cmd} register -> Create a bank account\n${cmd} info -> View your account info\n${cmd} history -> View all transaction history\n${cmd} nạp/gửi + amount -> Deposit money into bank account\n${cmd} rút/lấy + amount -> Withdraw money from bank account\n${cmd} top -> View richest users leaderboard\n${cmd} pay + stk -> Send money to an account number\n${cmd} vay + amount -> Borrow money from the bank\n${cmd} trả + amount -> Repay borrowed money\n${cmd} setpass + pass -> Set password\n${cmd} setstk + desired account number\n${cmd} login -> Log into account\n${cmd} logout -> Log out of account\n${cmd} delete -> Delete account\n${cmd} public on/off -> Make account info public\n${cmd} logloca -> Check login locations\n${cmd} 2fa -> Enable/disable 2fa\n\nTip: use ${cmd} + dash + first letter as shortcut\nEx: ${cmd} -r`);
            break;
    };
};
exports.handleReaction = async o=> {
    let f = o.handleReaction;

    o.api.unsendMessage(f.messageID);
    if (f.o.event.senderID == o.event.userID)f.callback(o);
};
exports.handleReply = async o=> {
    let f = o.handleReply;

    if (f.o.event.senderID == o.event.senderID)(res = await f.callback(o), res == undefined?o.api.unsendMessage(f.messageID): '');
};