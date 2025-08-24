// Simple Python test file for analysis
def calculate_fibonacci(n):
    if n <= 1:
        return n
    return calculate_fibonacci(n-1) + calculate_fibonacci(n-2)

def main():
    result = calculate_fibonacci(10)
    print(f"Fibonacci of 10 is: {result}")

if __name__ == "__main__":
    main()
