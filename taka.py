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
    params_list = [param.strip() for param in params_string.split(',')]

    if len(params_list) < 3:
        raise ValueError("Insufficient parameters provided. Ensure to provide key-value pairs followed by jukurendo and shokiSenzai.")
    
    params = {}
    for param in params_list[:-2]:
        key, value = param.split(' ')
        params[key.strip()] = value.strip().upper()  # Convert value to uppercase

    jukurendo = params_list[-2].strip()
    shokiSenzai = params_list[-1].strip()

    return params, jukurendo, shokiSenzai

def main():
    params, jukurendo, shokiSenzai = parse_arguments()

    input_to_select = {
        "-pp%": 'PhysicalPierce %',
        "aspd": 'ASPD',
        "cr": 'Critical Rate',
        "-matk%": 'MATK%',
        "-mres%": 'Magic Resistance %',
        "cd": 'Critical Damage',
        "dtefi%": 'Damage to Elemental Fiend %',
        "-mp%": 'MP %',
        "-acc": 'Accuracy',
        "-acc%": 'Accuracy %',
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
        minus_fields = [(f"minus_name_{i}", f"minus_value_{i}") for i in range(3)]
        plus_fields = [(f"plus_name_{i}", f"plus_value_{i}") for i in range(3)]
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
                    
                    # Verify if the option exists before selecting it
                    value_exists = any(option.get_attribute('value') == value for option in select_value.options)
                    if value_exists:
                        select_value.select_by_value(value)
                    else:
                        raise NoSuchElementException(f"Cannot locate option with value: {value}")
                    
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

                    # Verify if the option exists before selecting it
                    value_exists = any(option.get_attribute('value') == value for option in select_value.options)
                    if value_exists:
                        select_value.select_by_value(value)
                    else:
                        raise NoSuchElementException(f"Cannot locate option with value: {value}")

                    plus_index += 1

        # Set other dropdowns
        select_jukurendo = Select(driver.find_element(By.ID, "jukurendo"))
        select_jukurendo.select_by_value(jukurendo)

        select_shokiSenzai = Select(driver.find_element(By.ID, "shokiSenzai"))
        select_shokiSenzai.select_by_value(shokiSenzai)

        # Check and handle overlay if exists
        try:
            overlay = driver.find_element(By.CLASS_NAME, "fc-dialog-overlay")
            if overlay.is_displayed():
                driver.execute_script("arguments[0].style.display = 'none';", overlay)
        except:
            pass

        # Submit the form
        submit_button = driver.find_element(By.ID, "sendData")
        driver.execute_script("arguments[0].click();", submit_button)

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
