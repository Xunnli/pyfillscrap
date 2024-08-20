from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

# Set up the webdriver
options = Options()
options.add_argument('--headless')  # Menjalankan browser tanpa tampilan GUI
options.add_argument('--no-sandbox')
options.add_argument('--disable-dev-shm-usage')
driver = webdriver.Chrome(options=options)
driver.get("https://tanaka0.work/en/BouguProper")


input_to_select = {
    "-pp%": 'PhysicalPierce %',
    "aspd": 'ASPD',
    "cr": 'Critical Rate',
    "-matk%": 'MATK%',
    "-mres%": 'Magic Resistance %',
    "cd": 'Critical Damage',
    "max": 'MAX',
}

try:
    # Wait until the dropdowns are present
    wait = WebDriverWait(driver, 60)
    wait.until(EC.presence_of_element_located((By.ID, "minus_name_0")))
    wait.until(EC.presence_of_element_located((By.ID, "minus_value_0")))
    wait.until(EC.presence_of_element_located((By.ID, "plus_name_0")))
    wait.until(EC.presence_of_element_located((By.ID, "plus_value_0")))


    select_minus_name_0 = Select(driver.find_element(By.ID, "minus_name_0"))
    # Use text that matches the part of the option text
    for option in select_minus_name_0.options:
        if input_to_select['-pp%'] in option.text:
            select_minus_name_0.select_by_visible_text(option.text)
            break

    select_minus_value_0 = Select(driver.find_element(By.ID, "minus_value_0"))
    select_minus_value_0.select_by_value("MAX")

    select_minus_name_1 = Select(driver.find_element(By.ID, "minus_name_1"))
    # Use text that matches the part of the option text
    for option in select_minus_name_1.options:
        if input_to_select['-matk%'] in option.text:
            select_minus_name_1.select_by_visible_text(option.text)
            break

    select_minus_value_1 = Select(driver.find_element(By.ID, "minus_value_1"))
    select_minus_value_1.select_by_value("MAX")

    select_minus_name_2 = Select(driver.find_element(By.ID, "minus_name_2"))
    # Use text that matches the part of the option text
    for option in select_minus_name_2.options:
        if input_to_select['-mres%'] in option.text:
            select_minus_name_2.select_by_visible_text(option.text)
            break

    select_minus_value_2 = Select(driver.find_element(By.ID, "minus_value_2"))
    select_minus_value_2.select_by_value("MAX")




    select_plus_name_0 = Select(driver.find_element(By.ID, "plus_name_0"))
    # Use text that matches the part of the option text
    for option in select_plus_name_0.options:
        if input_to_select['aspd'] in option.text:
            select_plus_name_0.select_by_visible_text(option.text)
            break

    select_plus_value_0 = Select(driver.find_element(By.ID, "plus_value_0"))
    select_plus_value_0.select_by_value("10")

    select_plus_name_1 = Select(driver.find_element(By.ID, "plus_name_1"))
    # Use text that matches the part of the option text
    for option in select_plus_name_1.options:
        if input_to_select['cd'] in option.text:
            select_plus_name_1.select_by_visible_text(option.text)
            break

    select_plus_value_1 = Select(driver.find_element(By.ID, "plus_value_1"))
    select_plus_value_1.select_by_value("10")

    select_plus_name_2 = Select(driver.find_element(By.ID, "plus_name_2"))
    # Use text that matches the part of the option text
    for option in select_plus_name_2.options:
        if input_to_select['cr'] in option.text:
            select_plus_name_2.select_by_visible_text(option.text)
            break

    select_plus_value_2 = Select(driver.find_element(By.ID, "plus_value_2"))
    select_plus_value_2.select_by_value("MAX")




    select_jukurendo = Select(driver.find_element(By.ID, "jukurendo"))
    select_jukurendo.select_by_value("260")

    select_shokiSenzai = Select(driver.find_element(By.ID, "shokiSenzai"))
    select_shokiSenzai.select_by_value("110")

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
