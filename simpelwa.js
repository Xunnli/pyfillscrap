import axios from 'axios';
import qs from 'qs';
import https from 'https';

const variables = {
    "pp%": 'PhysicalPierce %',
    "mp%": 'Magic Pierce %',
    "acc": 'Accuracy',
    "atk%": 'ATK%',
    "matk%": 'MATK%',
    "acc%": 'Accuracy %',
    "dte%": '% Stronger Against Fire',
    "atk": 'ATK',
    "matk": 'MATK',
    "dodge": 'Dodge',
    "hpreg": 'Natural HP regen',
    "mpreg": 'Natural MP regen',
    "agi": 'AGI',
    "dex": 'DEX',
    "int": 'INT',
    "str": 'STR',
    "vit": 'VIT',
    "rte%": 'Fire Resistance %',
    "maxhp%": 'MaxHP%',
    "dodge%": 'Dodge %',
    "stab%": 'Stability%',
    "ail%": 'Ailment Resistance %',
    "def%": 'DEF%',
    "mdef%": 'MDEF%',
    "pres%": 'PhysicalResistance %',
    "mres%": 'Magic Resistance %',
    "cd%": 'Critical Damage%',
    "hpreg%": 'Natural HP regen%',
    "mpreg%": 'Natural MP regen%',
    "agi%": 'AGI%',
    "dex%": 'DEX%',
    "int%": 'INT%',
    "str%": 'STR%',
    "vit%": 'VIT%',
    "eva%": 'Evasion Rate %',
    "guard": 'Guard Power',
    "guard%": 'Guard Rate %',
    "maxmp": 'MaxMP',
    "aggro%": 'Aggro %',
    "hp": 'MaxHP',
    "def": 'DEF',
    "mdef": 'MDEF',
    "cd": 'Critical Damage',
    "aspd": 'ASPD',
    "cspd": 'CSPD',
    "aspd%": 'ASPD%',
    "caspd%": 'CSPD%',
    "cr": 'Critical Rate',
    "cr%": 'Critical Rate%',
    "foe%": '% Reduce Dmg (Foe Epicenter)',
    "bow%": '% Reduce Dmg (Bowling)',
    "bull%": '% Reduce Dmg (Bullet)',
    "flo%": '% Reduce Dmg (Floor)',
    "line": '% Reduce Dmg (Straight Line)',
    "Charge%": '% Reduce Dmg (Charge)',
    "epic%": '% Reduce Dmg (Player Epicenter)',
    "mete%": '% Reduce Dmg (Meteor)',
    "max": 'MAX',
    "prof": 'jukurendo',
    "pot": 'shokiSenzai'
};

const parseArgs = (args) => {
    const parsedArgs = {};
    args.split(',').forEach(pair => {
        const [key, value] = pair.split('=').map(part => part.trim());
        if (key && value) {
            parsedArgs[key] = value;
        }
    });
    return parsedArgs;
};

const isValidProperLvHyoji = (value) => {
    return !isNaN(value) || value.toLowerCase() === 'max' || value.toLowerCase() === 'min';
};

const buildDataObject = (parsedArgs, mseg) => {

    if (!parsedArgs.pot) {
        mseg.reply('`pot` wajib di isi.');
        return null;
    }

    const data = {
        properBui: 'Armor',
        paramLevel: 290,
        kisoSenzai: 15,
        jukurendo: 0,
        rikaiKinzoku: 10,
        rikaiNunoti: 10,
        rikaiKemono: 10,
        rikaiMokuzai: 10,
        rikaiYakuhin: 10,
        rikaiMaso: 10,
        sendData: 'Submit',
    };

    let plusIndex = 0;
    let minusIndex = 0;

    for (const [key, value] of Object.entries(parsedArgs)) {
        const properName = variables[key];

        if (!properName) {
            mseg.reply(`stats ${key} salah, cek lagi di .cheatsheet`);
            return null;
        }

        if (key === 'prof') {
            data.jukurendo = value;
        } else if (key === 'pot') {
            data.shokiSenzai = value;
        } else {
            let adjustedValue = value;

            if ((key === 'elematch' || key === 'elenon') && value.toLowerCase() !== 'max' && value.toLowerCase() !== 'min') {
                adjustedValue = '1';
            } else if (!isValidProperLvHyoji(value)) {
                mseg.reply('value wajib menggunakan angka / max / min\nPeriksa pemisah koma / Spasi');
                return null;
            }

            if (value.toLowerCase() === 'min') {
                if (minusIndex < 6) {
                    data[`minusProperList[${minusIndex}].properName`] = properName;
                    data[`minusProperList[${minusIndex}].properLvHyoji`] = 'MAX';
                    minusIndex++;
                } else {
                    mseg.reply('maksimal 6 input nega stats');
                    return null;
                }
            } else {
                if (plusIndex < 6) {
                    data[`plusProperList[${plusIndex}].properName`] = properName;
                    data[`plusProperList[${plusIndex}].properLvHyoji`] = adjustedValue.toUpperCase();
                    plusIndex++;
                } else {
                    mseg.reply('maksimal 6 input plus stats');
                    return null;
                }
            }
        }
    }

    return data;
};

export async function fillarm(mseg) {
    const a = mseg.body.slice(7);
    
    const args = a.toLowerCase();
    if (args) {
        try {
            const parsedArgs = parseArgs(args);

            const data = buildDataObject(parsedArgs, mseg);
            if (!data) {
                return;
            }

            let encodedData = qs.stringify(data, { arrayFormat: 'brackets', skipNulls: true });

            let encodedData1 = encodedData
                .replace(/%20/g, '+')
               // .replace(/\+%25/g, '%25');


            const config = {
                method: 'post',
                url: 'https://133.167.103.235/en/BouguProper',
                data: encodedData1,
                httpsAgent: new https.Agent({ rejectUnauthorized: false })
            };

            const response = await axios(config);

            const responseData = response.data;

            const cleanedData = responseData.replace(/<\/?[^>]+(>|$)/g, "");

            const lines = cleanedData.split('\n');

            const keywords = ['Remaining Pot', 'Highest mats per step', 'Metal:', 'Success Rate:', 'Error Happened', 'Steps', 'Mat cost pt', 'Statting of'];
        const filteredLines = lines
            .filter(line => keywords.some(keyword => line.includes(keyword)))
            .filter(line => !line.includes("Craftsman's"))
            .map(line => line.trim());

        // Extract specific lines
        const successRateLine = filteredLines.find(line => line.includes('Success Rate:'));
        const stepsLineIndex = filteredLines.findIndex(line => line.includes('Steps('));
        const stepsLines = filteredLines.slice(stepsLineIndex);
        const remainingLines = filteredLines.slice(0, stepsLineIndex).filter(line => !line.includes('Success Rate:'));

        const stattingOfWeaponLines = remainingLines.filter(line => line.includes('Statting of Armor'));
        const otherRemainingLines = remainingLines.filter(line => !line.includes('Statting of Armor'));


        // Function to format lines based on content
        const formatLine = (line) => {
            if (line.includes('Compassion Lv')) {
                return line.replace(/,/g, '\n').replace(/\n/g, ', ').replace(/:/g, ': ');
            }
            if (line.includes('Highest mats')) {
                return line.replace(/,/g, '\n').replace(/\n/g, ',');
            }
            if (line.includes('pt,')) {
                return line.replace(/pt,/g, '\n').replace(/:/g, ': ');
            }
            return line;
        };

        // Create formatted output
        const formattedOutput = [
            ...stattingOfWeaponLines,
            '',
            successRateLine,
            ...stepsLines,
            '',
           // formattedMatsLine,
            ...otherRemainingLines.map(formatLine)
        ].join('\n');

            mseg.reply(formattedOutput);


        } catch (error) {
            mseg.reply('input salah, cek .cheatsheet\n', error);
        }
    } else {
        return;
    }
};