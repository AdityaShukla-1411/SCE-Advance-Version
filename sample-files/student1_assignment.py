# Student submission 1 - Similar to sample_code.py
def fibonacci_calc(num):
    if num <= 1:
        return num
    return fibonacci_calc(num-1) + fibonacci_calc(num-2)

def run_program():
    answer = fibonacci_calc(10)
    print(f"The fibonacci number is: {answer}")

if __name__ == "__main__":
    run_program()
