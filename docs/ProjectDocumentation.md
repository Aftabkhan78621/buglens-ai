<!-- explain your project -->

one of My project is BugLens AI. It is an AI-powered bug report analysis tool built using Next.js, React, TypeScript, and Ollama Cloud.

I built this project to help developers understand software bugs and organize their initial debugging process.

A user can enter a bug title, description, environment, expected behavior, actual behavior, and error logs. The application validates this information and sends it to a Next.js API route.

The API sends the bug details to an AI model through Ollama Cloud. The model returns a structured analysis containing estimated severity, category, possible causes, missing information, and debugging suggestions.

I used Zod to validate both the input data and the AI response. I also added error handling for invalid requests and common AI service failures.

One important limitation is that the AI provides possible explanations, not confirmed root causes. The current version focuses on the analysis workflow; database storage and authentication are future improvements.



<!-- Explain the flow technically -->

First, the user fills in the bug report form. The frontend validates the fields using Zod.

When the user submits the form, the frontend sends a POST request to `/api/analyze`. The API route checks the content type, parses the request body, and validates the data again.

After successful validation, the API calls the `analyzeBugReport` function. This function builds a prompt and sends an authenticated request to Ollama Cloud.

The AI returns JSON text. My service parses this text and validates it against the expected Zod schema.

Finally, the API returns the analysis to the frontend, and the user can see the results. If an error occurs, the application returns or displays an error message.


<!-- questions & Answer -->

Q1. What is BugLens AI?
Answer
BugLens AI is an AI-powered bug report analysis tool. It helps developers understand reported software issues. It provides an estimated severity, category, possible causes, missing information, and debugging suggestions.

Q2. Why did you build this project?
I built this project to make the initial bug investigation more organized. Developers sometimes receive incomplete bug reports and need to decide what to investigate first. My application uses AI to provide structured guidance based on the available information.

Q3. What problem does your project solve?
It helps organize bug information and suggests possible investigation steps. Instead of reading an unstructured report, a developer can review a summary, possible causes, and missing information in one place. It supports the developer but does not replace manual debugging.

Q4. Who can use BugLens AI?
Software developers, QA engineers, and testing teams can use it to review bug reports. It can be useful when a team wants a structured starting point for investigating an issue. The current version is a prototype, so team management features are not yet implemented.

Q5. What are the main features of your project?
The main features are bug report submission, input validation, AI-powered analysis, severity and category classification, possible cause generation, missing information detection, and debugging suggestions. The application also handles several request and AI service errors.

B. Frontend and Next.js
Q6. Why did you use Next.js instead of React alone?
I used Next.js because it provides React-based pages and server-side API routes in the same application. This allowed me to build the user interface and the AI integration endpoint within one project. It also supports production builds and different rendering strategies.

Q7. What is the role of React in your project?
React builds the user interface using components and state. In my bug report form, state stores the user's input, validation errors, loading status, API errors, and AI analysis results. React updates the interface when this state changes.

Q8. Why did you use TypeScript?
I used TypeScript to define the structure of bug reports and analysis results. It helps catch many type-related mistakes during development. For example, I defined allowed environment and severity values instead of using unrestricted strings everywhere.

Q9. What is the purpose of useState in your form?
I use useState to store values that change when the user interacts with the form. It stores fields such as the title and description, as well as loading and error states. When the state changes, React updates the relevant part of the interface.

Q10. Why did you use Tailwind CSS?
I used Tailwind CSS to style the interface with utility classes directly in the components. It makes it easier to maintain consistent spacing, colors, borders, and responsive layouts. It also reduces the need to create separate CSS rules for every small UI element.

C. API and validation
Q11. What is /api/analyze?
It is a server-side POST endpoint in my Next.js application. It accepts the bug report as JSON, validates the request, calls the AI analysis service, and returns the result. It also handles invalid requests and known AI service errors.

Q12. Why did you use POST instead of GET?
I used POST because the client sends a structured bug report in the request body for processing. GET is generally intended for retrieving resources, while POST is suitable for submitting data for an operation. The endpoint does not use GET to send the report details.

Q13. What is Zod, and why did you use it?
Zod is a library for validating data at runtime. I use it to check that bug report fields follow the required rules and that the AI response has the expected structure. This helps prevent invalid data from moving further through the application.

Q14. Why do you validate data on both the frontend and backend?
Frontend validation gives users quick feedback before they submit a report. Backend validation is also necessary because someone can call the API directly without using my form. The server must validate incoming data independently.

Q15. What validation rules did you implement?
The title must contain 5 to 120 characters, and the description must contain 20 to 5,000 characters. The environment must be one of the supported values. Expected behavior and actual behavior can contain up to 2,000 characters each, while logs can contain up to 10,000 characters.

D. AI and Ollama Cloud
Q16. Why did you use Ollama Cloud?
I used Ollama Cloud to access a hosted AI model through an HTTP API. It allowed me to add AI analysis without hosting the model on my own computer. I can configure the API key and model through server-side environment variables.

Q17. How does your application communicate with the AI model?
The server uses the Fetch API to send a POST request to the Ollama Cloud chat endpoint. The request contains the selected model, the prompt, and generation settings. The API key is sent in the authorization header.

Q18. What is prompt engineering in your project?
Prompt engineering means giving the AI clear instructions about how to analyze the report and format its response. My prompt asks the model to identify possible causes, explain supporting evidence, identify missing information, and return JSON. It also tells the model not to invent facts or treat hypotheses as confirmed causes.

Q19. Why do you ask the model to return JSON?
JSON provides a predictable structure that the application can parse. Instead of handling one long paragraph, the frontend can display severity, category, causes, and actions separately. I also validate the generated structure before returning it to the client.

Q20. What is the purpose of temperature in your AI request?
Temperature controls how much variation the model may introduce during generation. I configured it to 0.2 because I want relatively consistent and structured responses. A low temperature does not guarantee that the response will be correct.

Q21. How do you know if the AI response is valid?
First, the service checks whether the provider response contains a message with string content. Then it parses that content as JSON and validates the result against a Zod schema. If the JSON is malformed or the required fields do not match, the analysis is rejected.

E. Error handling, security and limitations
Q22. How does your application handle errors?
The API handles invalid content types, malformed JSON, and validation failures. The AI service also maps common HTTP failures, such as authentication problems, rate limits, and service errors, into known error types. The frontend catches failed requests and displays an error message.

Q23. What happens if Ollama Cloud is unavailable?
The request may fail, and the application returns an error instead of showing a successful analysis. The service retries selected transient HTTP failures once. The user can then try again when the service becomes available.

Q24. How do you protect your API key?
I keep the API key in the server-side .env.local file and read it using process.env. The .env* rule in .gitignore excludes environment files from normal Git tracking. The key should never be included in client-side code or committed to the repository.

Q25. Can the AI always find the correct root cause?
No. The AI only generates possible explanations based on the information provided. The real cause must be confirmed by checking the code, logs, database, or other relevant evidence. That is why the application presents causes as hypotheses.

Q26. Have you implemented MongoDB and authentication?
No, not in the current version. The current focus is the bug report submission and AI analysis workflow. Database persistence and authentication are planned improvements, so I would not describe them as implemented features.

F. Testing, architecture and future improvements
Q27. How did you test your project?
I tested the bug report form with a sample bug and confirmed that the AI analysis was returned and displayed. I also ran npm run build, which completed successfully with TypeScript checks. I would still test more invalid inputs, AI failures, and edge cases before considering the application production-ready.

Q28. Why did you separate validation, types, and AI logic into different files?
I separated them to keep each module focused on one responsibility. The validation file defines input rules, the types file defines TypeScript data structures, and the AI service handles communication with Ollama Cloud. This makes the code easier to understand and maintain.

Q29. What would you improve next?
I would first add MongoDB to store bug reports and their analysis results. Then I would add authentication, report history, search, status management, automated tests, and production monitoring. I would also evaluate AI output quality against a set of known bug reports.

Q30. What did you learn from this project?
I learned how to connect a React frontend to a Next.js API route and integrate an external AI service. I also learned the importance of runtime validation, structured AI output, error handling, and keeping API keys on the server. The project helped me understand how frontend, backend, and AI components work together.

Part 4 — Interview se pehle ye 5 technical points pakke karna
Ye points cross-question mein important hain:
1. AI aur root cause: AI suggestions deta hai; actual root cause verify karna developer ka kaam hai.
2. Frontend vs backend validation: Frontend user ko quick feedback deta hai; backend direct API calls ko bhi validate karta hai.
3. JSON + Zod: Prompt model ko JSON return karne ko kehta hai; Zod returned data ki structure check karta hai.
4. API key security: Key server-side environment variable mein rehti hai; use React component mein nahi rakhna.





<!--project hierarchi -->


Project ka complete workflow
1. User enters bug details
Title, description, environment, expected/actual behavior and logs


2. Frontend validation
React state and Zod schema check the input


3. Next.js API route
POST /api/analyze parses and validates the request again


4. Ollama Cloud
Receives the prompt and generates a structured JSON response


5. AI response validation
JSON parsing and Zod schema validation


6. Results displayed
The frontend shows the analysis or a useful error message


Ye workflow source code mein implemented hai: frontend /api/analyze ko POST request bhejta hai, API analyzeBugReport() call karti hai aur validated analysis return karti hai. 

GitHub
+2



4. Har important technology ka role
Technology	Project mein iska kaam
Next.js	Pages, layouts aur server-side API route
React	Form, input fields, loading state aur results UI
TypeScript	Data types aur compile-time checking
Tailwind CSS	UI styling aur responsive layout
Zod	User input aur AI output ki runtime validation
Ollama Cloud	AI analysis generate karna
Fetch API	Server se Ollama Cloud ko HTTP request bhejna
Git/GitHub	Code history aur remote repository
5. Project ki important files
File	Simple explanation
src/app/page.tsx	Root page
src/app/(dashboard)/layout.tsx	Dashboard pages ka shared layout
src/app/(dashboard)/dashboard/page.tsx	Dashboard screen
src/app/(dashboard)/reports/new/page.tsx	Bug report form, validation aur result display
src/app/api/analyze/route.ts	POST API endpoint, validation aur error handling
src/lib/validation/bug-report.ts	Incoming report ke validation rules
src/lib/ai/gemini.ts	Actual Ollama Cloud request, prompt aur AI response parsing
src/types/bug-report.ts	Bug report, severity, environment aur status ke TypeScript types
src/components/dashboard/	Dashboard UI components
src/components/layout/Sidebar/index.tsx	Dashboard sidebar
gemini.ts naam thoda confusing hai: current code mein is file ke andar Ollama Cloud use ho raha hai, Gemini API nahi. 

