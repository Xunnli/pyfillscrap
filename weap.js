import axios from 'axios';
import qs from 'qs';
import https from 'https';

// Mapping of variable names to proper names
const variables = {
    "str": 'STR',
    "str%": 'STR%',
    "int": 'INT',
    "int%": 'INT%',
    "vit": 'VIT',
    "vit%": 'VIT%',
    "agi": 'AGI',
    "agi%": 'AGI%',
    "dex": 'DEX',
    "dex%": 'DEX%',
    "hpreg": 'Natural HP regen',
    "hpreg%": 'Natural HP regen%',
    "mpreg": 'Natural MP regen',
    "mpreg%": 'Natural MP regen%',
    "hp": 'MaxHP',
    "maxhp%": 'MaxHP%',
    "maxmp": 'MaxMP',
    "atk": 'ATK',
    "atk%": 'ATK%',
    "matk": 'MATK',
    "matk%": 'MATK%',
    "stab%": 'Stability%',
    "pp%": 'PhysicalPierce %',
    "mp%": 'Magic Pierce %',
    "def": 'DEF',
    "mdef": 'MDEF',
    "def%": 'DEF%',
    "mdef%": 'MDEF%',
    "pres%": 'PhysicalResistance %',
    "mres%": 'Magic Resistance %',
    "foe%": '% Reduce Dmg (Foe Epicenter)',
    "bow%": '% Reduce Dmg (Bowling)',
    "bull%": '% Reduce Dmg (Bullet)',
    "flo%": '% Reduce Dmg (Floor)',
    "line%": '% Reduce Dmg (Straight Line)',
    "Charge%": '% Reduce Dmg (Charge)',
    "epic%": '% Reduce Dmg (Player Epicenter)',
    "mete%": '% Reduce Dmg (Meteor)',
    "acc": 'Accuracy',
    "acc%": 'Accuracy %',
    "dodge": 'Dodge',
    "dodge%": 'Dodge %',
    "aspd": 'ASPD',
    "aspd%": 'ASPD%',
    "cspd": 'CSPD',
    "cspd%": 'CSPD%',
    "cr": 'Critical Rate',
    "cr%": 'Critical Rate%',
    "cd": 'Critical Damage',
    "cd%": 'Critical Damage%',
    "dte%": '% Stronger Against Fire',
    "rte%": 'fire Resistance %',
    "ail%": 'Ailment Resistance %',
    "eva%": 'Evasion Rate %',
    "guard": 'Guard Power',
    "guard%": 'Guard Rate %',
    "aggro%": 'Aggro %',
    "elematch": 'Fire Element(matching)',
    "elenon": 'Fire Element(not matching)',
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
    //.replace(/\+%25/g, '%25') // Ensure % is encoded correctly

console.log(encodedData1)

const config = {
    method: 'post',
    url: 'https://133.167.103.235/en/BukiProper',
    data: encodedData1,
    httpsAgent: new https.Agent({ rejectUnauthorized: false }) 
};

axios(config)
    .then(function (response) {
        // Get the response data and remove HTML tags
        const cleanedData = response.data.replace(/<\/?[^>]+(>|$)/g, "");

        // Split the cleaned data into lines
        const lines = cleanedData.split('\n');

        // Define keywords for filtering
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

        const stattingOfWeaponLines = remainingLines.filter(line => line.includes('Statting of Weapon'));
        const otherRemainingLines = remainingLines.filter(line => !line.includes('Statting of Weapon'));


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

        // Display the formatted output
        console.log(formattedOutput);
    })
    .catch(function (error) {
        console.error('Input error:', error);
    });