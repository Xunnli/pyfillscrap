import axios from 'axios';
import qs from 'qs';
import https from 'https';

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
    //.replace(/\+%25/g, '%25') // Ensure % is encoded correctly

console.log(encodedData1)

const config = {
    method: 'post',
    url: 'https://133.167.103.235/en/BouguProper',
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
        const keywords = ['Remaining Pot', 'Highest mats per step', 'Metal:', 'Success Rate:', 'Error Happened', 'Steps', 'Mat cost pt'];
        const filteredLines = lines.filter(line => keywords.some(keyword => line.includes(keyword))).map(line => line.trim());

        // Extract specific lines
        const successRateLine = filteredLines.find(line => line.includes('Success Rate:'));
        const stepsLineIndex = filteredLines.findIndex(line => line.includes('Steps('));
        const stepsLines = filteredLines.slice(stepsLineIndex);
        const remainingLines = filteredLines.slice(0, stepsLineIndex).filter(line => !line.includes('Success Rate:'));


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
            successRateLine,
            ...stepsLines,
            '',
           // formattedMatsLine,
            ...remainingLines.map(formatLine)
        ].join('\n');

        // Display the formatted output
        console.log(formattedOutput);
    })
    .catch(function (error) {
        console.error('Input error:', error);
    });
