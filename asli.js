import axios from 'axios';
import qs from 'qs';

// Mapping of variable names to proper names
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

// Function to parse command line arguments
const parseArgs = () => {
    const args = process.argv.slice(2);
    const parsedArgs = {};

    args.forEach(arg => {
        arg.split(',').forEach(pair => {
            const [key, value] = pair.split('=').map(part => part.trim());
            if (key && value) {
                parsedArgs[key] = value;
            }
        });
    });

    return parsedArgs;
};

// Function to build the data object based on parsed arguments
const buildDataObject = (parsedArgs) => {
    const data = {
        properBui: 'Weapon',
        paramLevel: 290,
        //shokiSenzai: 70,
       // jukurendo:  260,
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
            console.error(`Invalid key: ${key}`);
            continue;
        }

        if (key === 'prof') {
            data.jukurendo = value;
        } else if (key === 'pot') {
            data.shokiSenzai = value;
        } else {
            if (value.toLowerCase() === 'min') {
                data[`minusProperList[${minusIndex}].properName`] = properName;
                data[`minusProperList[${minusIndex}].properLvHyoji`] = 'MAX';
                minusIndex++;
            } else {
                data[`plusProperList[${plusIndex}].properName`] = properName;
                data[`plusProperList[${plusIndex}].properLvHyoji`] = value.toUpperCase();
                plusIndex++;
            }
        }
    }


    return data;
};

// Parse command line arguments
const parsedArgs = parseArgs();

// Build the data object
const data = buildDataObject(parsedArgs);

let encodedData = qs.stringify(data, { arrayFormat: 'brackets', skipNulls: true });

// Replace %20 with +
let encodedData1 = encodedData
    .replace(/%20/g, '+')   // Replace %20 with +
    .replace(/\+%25/g, '%25') // Ensure % is encoded correctly

console.log(encodedData1)

const config = {
    method: 'post',
    url: 'https://tanaka0.work/en/BukiProper',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
        'Accept-Encoding': 'gzip, deflate, br, zstd',
        'Accept-Language': 'en-US,en;q=0.9,id-ID;q=0.8,id;q=0.7,ja-JP;q=0.6,ja;q=0.5',
        'Cache-Control': 'max-age=0',
        'Connection': 'keep-alive',
        'Host': 'tanaka0.work',
        'Origin': 'https://tanaka0.work',
        'Referer': 'https://tanaka0.work/en/BukiProper',
        'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
        'Sec-Ch-Ua-Mobile': '?0',
        'Sec-Ch-Ua-Platform': '"Windows"',
        'Sec-Fetch-Dest': 'document',
        'Sec-Fetch-Mode': 'navigate',
        'Sec-Fetch-Site': 'same-origin',
        'Sec-Fetch-User': '?1',
        'Upgrade-Insecure-Requests': '1',
    },
    data: encodedData1
};

axios(config)
    .then(function (response) {
        // Get the response data as text
        const responseData = response.data;

        // Remove HTML tags
        const cleanedData = responseData.replace(/<\/?[^>]+(>|$)/g, "");

        // Split the cleaned data into lines
        const lines = cleanedData.split('\n');

        // Filter lines containing the specified keywords
        const keywords = ['Remaining Pot', 'Highest mats per step', 'Metal:', 'Success Rate:', 'Error Happened', 'Steps'];
        const filteredLines = lines.filter(line => {
            return keywords.some(keyword => line.includes(keyword));
        });

        // Display the filtered lines
        filteredLines.forEach(line => console.log(line));
    })
    .catch(function (error) {
        console.error('input salah');
    });
