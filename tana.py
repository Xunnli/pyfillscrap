import sys
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

def parse_arguments():
    # Read arguments from the command line
    if len(sys.argv) < 2:
        raise ValueError("Please provide the arguments as a single comma-separated string.")

    params_string = ' '.join(sys.argv[1:])
    params_list = params_string.split(',')

    if len(params_list) < 3:
        raise ValueError("Insufficient parameters provided. Ensure to provide key-value pairs followed by jukurendo and shokiSenzai.")
    
    params = {}
    for param in params_list[:-2]:
        key, value = param.strip().split(' ')
        params[key] = value

    jukurendo = params_list[-2].strip()
    shokiSenzai = params_list[-1].strip()

    return params, jukurendo, shokiSenzai

def main():
    params, jukurendo, shokiSenzai = parse_arguments()

    input_to_select = {
        "pp%": 'PhysicalPierce %',
        "mp%": 'Magic Pierce %',
        "acc": 'Accuracy',
        "atk%": 'ATK%',
        "matk%": 'MATK%',
        "acc%": 'Accuracy %',
        "dteli%": '% Stronger Against Light',
        "dteea%": '% Stronger Against Earth',
        "dtewa%": '% Stronger Against Water',
        "dtefi%": '% Stronger Against Fire',
        "dteda%": '% Stronger Against Dark',
        "dtewi%": '% Stronger Against Wind',
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
        "resli%": 'Light Resistance %',
        "resea%": 'Earth Resistance %',
        "reswa%": 'Water Resistance %',
        "resfi%": 'Fire Resistance %',
        "resda%": 'Dark Resistance %',
        "reswi%": 'Wind Resistance %',
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
        "-pp%": 'PhysicalPierce %',
        "-mp%": 'Magic Pierce %',
        "-acc": 'Accuracy',
        "-atk%": 'ATK%',
        "-matk%": 'MATK%',
        "-acc%": 'Accuracy %',
        "-dteli%": '% Stronger Against Light',
        "-dteea%": '% Stronger Against Earth',
        "-dtewa%": '% Stronger Against Water',
        "-dtefi%": '% Stronger Against Fire',
        "-dteda%": '% Stronger Against Dark',
        "-dtewi%": '% Stronger Against Wind',
        "-atk": 'ATK',
        "-matk": 'MATK',
        "-dodge": 'Dodge',
        "-hpreg": 'Natural HP regen',
        "-mpreg": 'Natural MP regen',
        "-agi": 'AGI',
        "-dex": 'DEX',
        "-int": 'INT',
        "-str": 'STR',
        "-vit": 'VIT',
        "-resli%": 'Light Resistance %',
        "-resea%": 'Earth Resistance %',
        "-reswa%": 'Water Resistance %',
        "-resfi%": 'Fire Resistance %',
        "-resda%": 'Dark Resistance %',
        "-reswi%": 'Wind Resistance %',
        "-maxhp%": 'MaxHP%',
        "-dodge%": 'Dodge %',
        "-stab%": 'Stability%',
        "-ail%": 'Ailment Resistance %',
        "-def%": 'DEF%',
        "-mdef%": 'MDEF%',
        "-pres%": 'PhysicalResistance %',
        "-mres%": 'Magic Resistance %',
        "-cd%": 'Critical Damage%',
        "-hpreg%": 'Natural HP regen%',
        "-mpreg%": 'Natural MP regen%',
        "-agi%": 'AGI%',
        "-dex%": 'DEX%',
        "-int%": 'INT%',
        "-str%": 'STR%',
        "-vit%": 'VIT%',
        "-eva%": 'Evasion Rate %',
        "-guard": 'Guard Power',
        "-guard%": 'Guard Rate %',
        "-maxmp": 'MaxMP',
        "-aggro%": 'Aggro %',
        "-hp": 'MaxHP',
        "-def": 'DEF',
        "-mdef": 'MDEF',
        "-cd": 'Critical Damage',
        "-aspd": 'ASPD',
        "-cspd": 'CSPD',
        "-aspd%": 'ASPD%',
        "-caspd%": 'CSPD%',
        "-cr": 'Critical Rate',
        "-cr%": 'Critical Rate%',
        "-foe%": '% Reduce Dmg (Foe Epicenter)',
        "-bow%": '% Reduce Dmg (Bowling)',
        "-bull%": '% Reduce Dmg (Bullet)',
        "-flo%": '% Reduce Dmg (Floor)',
        "-line": '% Reduce Dmg (Straight Line)',
        "-Charge%": '% Reduce Dmg (Charge)',
        "-epic%": '% Reduce Dmg (Player Epicenter)',
        "-mete%": '% Reduce Dmg (Meteor)',
        "max": 'MAX',
    }

    # Set up the webdriver
    options = Options()
    options.add_argument('--headless')  # Menjalankan browser tanpa tampilan GUI
    options.add_argument('--no-sandbox')
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(options=options)
    driver.get("https://tanaka0.work/en/BouguProper")

    try:
        # Wait until the dropdowns are present
        wait = WebDriverWait(driver, 60)
        wait.until(EC.presence_of_element_located((By.ID, "minus_name_0")))
        wait.until(EC.presence_of_element_located((By.ID, "minus_value_0")))
        wait.until(EC.presence_of_element_located((By.ID, "plus_name_0")))
        wait.until(EC.presence_of_element_located((By.ID, "plus_value_0")))

        # Handle minus and plus fields
        minus_fields = [(f"minus_name_{i}", f"minus_value_{i}") for i in range(6)]
        plus_fields = [(f"plus_name_{i}", f"plus_value_{i}") for i in range(6)]
        minus_index = 0
        plus_index = 0

        for key, value in params.items():
            if key.startswith('-'):
                if minus_index < len(minus_fields):
                    name_field, value_field = minus_fields[minus_index]
                    select_name = Select(driver.find_element(By.ID, name_field))
                    select_value = Select(driver.find_element(By.ID, value_field))
                    
                    # Use text that matches the part of the option text
                    for option in select_name.options:
                        if input_to_select[key] in option.text:
                            select_name.select_by_visible_text(option.text)
                            break
                    select_value.select_by_value(value.upper())
                    minus_index += 1
            else:
                if plus_index < len(plus_fields):
                    name_field, value_field = plus_fields[plus_index]
                    select_name = Select(driver.find_element(By.ID, name_field))
                    select_value = Select(driver.find_element(By.ID, value_field))
                    
                    # Use text that matches the part of the option text
                    for option in select_name.options:
                        if input_to_select[key] in option.text:
                            select_name.select_by_visible_text(option.text)
                            break
                    select_value.select_by_value(value)
                    plus_index += 1

        # Set other dropdowns
        select_jukurendo = Select(driver.find_element(By.ID, "jukurendo"))
        select_jukurendo.select_by_value(jukurendo)

        select_shokiSenzai = Select(driver.find_element(By.ID, "shokiSenzai"))
        select_shokiSenzai.select_by_value(shokiSenzai)

        # Submit the form
        submit_button = driver.find_element(By.ID, "sendData")
        submit_button.click()

        # Wait for the results to load by checking for any of the divs containing result data
        wait.until(EC.presence_of_element_located((By.XPATH, "//div[descendant::h3[text()='Result']]")))

        # Capture all text from the results divs
        result_divs = driver.find_elements(By.XPATH, "//div[descendant::h3[text()='Result'] or descendant::font[@color='blue'] or descendant::span]")
        results_text = "\n".join([div.text for div in result_divs])

        # Debugging: print the page source if the element is not found
        if not results_text:
            print(driver.page_source)

        # Filter the results for specific text and eliminate duplicates
        keywords = ["Remaining Pot", "Highest mats per step", "Metal:", "Success Rate:"]
        filtered_results = []
        seen_lines = set()
        
        for line in results_text.split("\n"):
            if any(keyword in line for keyword in keywords) and line not in seen_lines:
                filtered_results.append(line)
                seen_lines.add(line)

        # Print the filtered results
        for result in filtered_results:
            print(result)

    finally:
        # Close the webdriver
        driver.quit()

if __name__ == "__main__":
    main()
