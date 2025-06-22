import os
import json
from dotenv import load_dotenv
from groq import Groq
import pandas as pd
import requests
from bs4 import BeautifulSoup
import time

# Load environment variables
load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set in .env")

# Initialize Groq client
client = Groq(api_key=GROQ_API_KEY)


def ask_groq(prompt: str) -> str:
    try:
        response = client.chat.completions.create(
            model=GROQ_MODEL,
            messages=[{"role": "user", "content": prompt}],
            max_completion_tokens=2048,
            temperature=0.7,
        )
        return response.choices[0].message.content.strip()
    except Exception as e:
        return f"Error: {str(e)}"


def fetch_url_content(url: str) -> str:
    """Fetch content from a URL and return cleaned text"""
    try:
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()

        soup = BeautifulSoup(response.content, 'html.parser')
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()

        # Get text and clean it
        text = soup.get_text()
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)

        return text[:3000]  # Limit to first 3000 characters
    except Exception as e:
        return f"Unable to fetch content from {url}: {str(e)}"


def create_directories():
    """Create output directories if they don't exist"""
    os.makedirs("questions", exist_ok=True)
    os.makedirs("coding_questions", exist_ok=True)


def save_json_file(data: dict, folder: str, filename: str):
    """Save data as JSON file"""
    filepath = os.path.join(folder, filename)
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)


class QuestionItem:
    def __init__(self, number, question, answer, category, difficulty):
        self.number = number
        self.question = question
        self.answer = answer
        self.category = category
        self.difficulty = difficulty

    def to_json_dict(self):
        return {
            "question": self.question,
            "correct_answer": self.answer,
            "difficulty": self.difficulty,
            "category": self.category
        }

    def __repr__(self):
        return f"Q{self.number} ({self.category}, {self.difficulty}): {self.question} → {self.answer}"


class CodingTaskItem:
    def __init__(self, number, title, topic, video, difficulty, companies=""):
        self.number = number
        self.title = title
        self.topic = topic
        self.video = video
        self.difficulty = difficulty
        self.companies = companies

    def __repr__(self):
        if self.companies:
            return f"{self.title} ({self.topic}, {self.difficulty}) – {self.video} [Companies: {self.companies}]"
        else:
            return f"{self.title} ({self.topic}, {self.difficulty}) – {self.video}"


def process_groq_theory_response(response: str, original_questions: list, topic: str):
    """Process Groq response for theory questions and create JSON files"""
    print("\nProcessing theory questions...")

    # Extract question numbers or references from Groq response
    prompt = f"""
    Based on this response about relevant questions for topic '{topic}':

    {response}

    Extract the question numbers or identify which questions were selected. Return only the numbers separated by commas (e.g., "1,3,5,7,9").
    If no clear numbers are present, return "NEED_CONTENT_ANALYSIS".
    """

    numbers_response = ask_groq(prompt)

    if "NEED_CONTENT_ANALYSIS" in numbers_response:
        # If we can't extract numbers, let Groq create questions based on the content
        selected_questions = create_questions_from_groq_response(response, topic)
    else:
        # Extract the selected questions based on numbers
        try:
            selected_numbers = [int(n.strip()) for n in numbers_response.split(',') if n.strip().isdigit()]
            selected_questions = [q for q in original_questions if q.number in selected_numbers]
        except:
            selected_questions = original_questions[:5]  # Fallback to first 5

    # Save each question as a separate JSON file
    for i, question in enumerate(selected_questions, 1):
        filename = f"question_{i:02d}.json"
        save_json_file(question.to_json_dict(), "questions", filename)
        print(f"Saved: {filename}")


def create_questions_from_groq_response(response: str, topic: str):
    """Create QuestionItem objects from Groq response content"""
    prompt = f"""
    From this response about questions for topic '{topic}':

    {response}

    Extract individual questions and format them as JSON objects with these fields:
    - question: the actual question text
    - correct_answer: the answer
    - difficulty: estimate difficulty as Easy/Medium/Hard
    - category: categorize based on the topic

    Return as a JSON array of objects. Maximum 8 questions.
    """

    json_response = ask_groq(prompt)

    try:
        questions_data = json.loads(json_response)
        questions = []
        for i, q_data in enumerate(questions_data, 1):
            question = QuestionItem(
                number=i,
                question=q_data.get('question', ''),
                answer=q_data.get('correct_answer', ''),
                category=q_data.get('category', topic),
                difficulty=q_data.get('difficulty', 'Medium')
            )
            questions.append(question)
        return questions
    except:
        return []


def process_groq_coding_response(response: str, original_tasks: list, topic: str):
    """Process Groq response for coding tasks and create JSON files"""
    print("\nProcessing coding questions...")

    # First, let Groq identify which tasks were selected
    prompt = f"""
    From this response about coding tasks for topic '{topic}':

    {response}

    Extract the task names/titles that were selected. Return them as a simple list, one per line.
    """

    titles_response = ask_groq(prompt)
    selected_titles = [title.strip() for title in titles_response.split('\n') if title.strip()]

    # Find matching tasks
    selected_tasks = []
    for title in selected_titles:
        for task in original_tasks:
            if title.lower() in task.title.lower() or task.title.lower() in title.lower():
                selected_tasks.append(task)
                break

    # If we couldn't match, take first 5 tasks
    if not selected_tasks:
        selected_tasks = original_tasks[:5]

    # Process each selected task
    for i, task in enumerate(selected_tasks, 1):
        print(f"Processing coding task {i}: {task.title}")

        # Search for the problem description online
        problem_search_prompt = f"""
        Search online for the complete problem description of "{task.title}" leetcode problem.
        Provide the full problem statement including:
        - Problem description
        - Input and output format
        - Constraints
        - Examples with explanations
        - Function signature/initial code structure (like class Solution with the method signature)

        Format it as a complete problem statement that a developer would see on LeetCode.
        """

        print(f"  Searching for problem description: {task.title}")
        problem_description = ask_groq(problem_search_prompt)

        # Search for the solution online
        solution_search_prompt = f"""
        Search online for the optimal solution to "{task.title}" leetcode problem.
        Provide:
        - Complete working code solution
        - Algorithm explanation
        - Time complexity analysis
        - Space complexity analysis
        - Step-by-step approach explanation

        Focus on the most efficient and commonly accepted solution.
        """

        print(f"  Searching for solution: {task.title}")
        solution = ask_groq(solution_search_prompt)

        # Create the JSON structure
        task_data = {
            "name": task.title,
            "question": problem_description if problem_description and len(
                problem_description.strip()) > 50 else f"Find the complete problem description for {task.title} on LeetCode",
            "correct_answer": solution if solution and len(
                solution.strip()) > 50 else f"Find the optimal solution for {task.title} problem",
            "difficulty": task.difficulty,
            "category": task.topic,
            "companies": task.companies
        }

        filename = f"coding_question_{i:02d}.json"
        save_json_file(task_data, "coding_questions", filename)
        print(f"Saved: {filename}")

        # Add delay between requests to avoid rate limiting
        time.sleep(2)


if __name__ == "__main__":
    # Create output directories
    create_directories()

    # Load Q&A CSV
    print("Loading questions CSV...")
    df = pd.read_csv("questions.csv", encoding="latin1")
    questions = [
        QuestionItem(
            number=row["Question Number"],
            question=row["Question"],
            answer=row["Answer"],
            category=row["Category"],
            difficulty=row["Difficulty"]
        )
        for _, row in df.iterrows()
    ]

    # Load and merge coding tasks
    print("Loading coding tasks CSVs...")
    df1 = pd.read_csv("coding_tasks.csv", encoding="latin1")
    df2 = pd.read_csv("coding_tasks2.csv", encoding="latin1")
    df_combined = pd.concat([df1, df2], ignore_index=True)

    # Normalize columns
    df_combined.columns = [col.strip() for col in df_combined.columns]

    coding_tasks = []
    for _, row in df_combined.iterrows():
        companies = row.get("companies", row.get("Companies", "")).strip() if pd.notna(
            row.get("companies", row.get("Companies", ""))) else ""
        difficulty = row.get("Level", row.get("Difficulty", "Unknown"))

        coding_tasks.append(
            CodingTaskItem(
                number=row.get("Num", ""),
                title=row["LeetCode Problem"],
                topic=row["Topic"],
                video=row["Video Explanation"],
                difficulty=difficulty,
                companies=companies
            )
        )

    # Get topic from user
    topic = input("Enter a topic to find relevant theory and coding tasks: ").strip()

    ### --- First Request: Theory Q&A ---
    print(f"\nFinding relevant theoretical questions for topic: {topic}")

    question_list_str = "\n".join(
        [f"{q.number}. {q.question} → {q.answer}" for q in questions[:50]]  # Limit to avoid token limits
    )

    prompt_qa = (
        f"Here is a list of theoretical questions with answers:\n\n{question_list_str}\n\n"
        f"Select the 5–8 most relevant ones based on the topic '{topic}'. "
        f"For each selected question, provide the question number and explain why it's relevant."
    )

    theory_response = ask_groq(prompt_qa)
    print("\nGroq's Theory Response:")
    print(theory_response)

    # Process theory questions and save as JSON
    process_groq_theory_response(theory_response, questions, topic)

    ### --- Second Request: Coding Tasks ---
    print(f"\nFinding relevant coding tasks for topic: {topic}")

    coding_task_str = "\n".join(
        [f"- {task.title} ({task.topic}, {task.difficulty}) – {task.video}" +
         (f" [Companies: {task.companies}]" if task.companies else "")
         for task in coding_tasks[:30]]  # Limit to avoid token limits
    )

    prompt_tasks = (
        f"Here is a list of coding interview tasks:\n\n{coding_task_str}\n\n"
        f"Select the 3–5 most relevant tasks based on the topic '{topic}'. "
        f"List the selected task titles and explain why each is relevant to the topic."
    )

    task_response = ask_groq(prompt_tasks)
    print("\nGroq's Coding Tasks Response:")
    print(task_response)

    # Process coding tasks and save as JSON
    process_groq_coding_response(task_response, coding_tasks, topic)

    print(f"\nCompleted! Check 'questions/' and 'coding_questions/' folders for JSON files.")
    print(f"Generated files based on topic: {topic}")