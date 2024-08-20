from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException, ElementClickInterceptedException
import sys
import time

def main():
    if len(sys.argv) < 2:
        print("Usage: python tana.py <arguments>")
        return

    input_text = ' '.join(sys.argv[1:])
    fill_form(input_text)

def fill_form(input_text):
    variables = {
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

    chrome_options = Options()
    chrome_options.add_argument('--headless')
    chrome_options.add_argument('--no-sandbox')

    service = Service(executable_path="/home/container/command/chromedriver")

    try:
        browser = webdriver.Chrome(service=service, options=chrome_options)
        wait = WebDriverWait(browser, 10)
        browser.get('https://tanaka0.work/en/BouguProper')

        parts = input_text.split(',')

        shoki_senzai_value = parts.pop(0).strip()

        minus_index = 0
        plus_index = 0

        for item in parts:
            parts = item.strip().split(' ')
            if len(parts) == 2:
                input_name = parts[0]
                value = parts[1]

                if input_name and value and variables.get(input_name):
                    if input_name.startswith('-'):
                        if value.upper() == 'MAX':
                            browser.execute_script(f"document.querySelector('#minus_name_{minus_index}').value = '{variables[input_name]}'")
                        else:
                            minus_name_dropdown = wait.until(EC.element_to_be_clickable((By.ID, f"minus_name_{minus_index}")))
                            minus_value_dropdown = wait.until(EC.element_to_be_clickable((By.ID, f"minus_value_{minus_index}")))
                            select_option(browser, minus_name_dropdown, variables[input_name])
                            select_option(browser, minus_value_dropdown, value)
                        minus_index += 1
                    else:
                        if value.upper() == 'MAX':
                            browser.execute_script(f"document.querySelector('#plus_name_{plus_index}').value = '{variables[input_name]}'")
                        else:
                            plus_name_dropdown = wait.until(EC.element_to_be_clickable((By.ID, f"plus_name_{plus_index}")))
                            plus_value_dropdown = wait.until(EC.element_to_be_clickable((By.ID, f"plus_value_{plus_index}")))
                            select_option(browser, plus_name_dropdown, variables[input_name])
                            select_option(browser, plus_value_dropdown, value)
                        plus_index += 1

        # Click the submit button
        submit_button = wait.until(EC.element_to_be_clickable((By.ID, "sendData")))
        submit_button.click()

        # Optionally, wait for the page to load after submission
        # WebDriverWait(browser, 10).until(EC.url_contains('#output'))

    finally:
        browser.quit()

def select_option(browser, dropdown_element, option_text):
    select = Select(dropdown_element)
    select.select_by_visible_text(option_text)

if __name__ == "__main__":
    main()
