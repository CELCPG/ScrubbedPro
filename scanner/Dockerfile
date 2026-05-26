FROM python:3.11-slim

WORKDIR /app

# Install Playwright browsers
RUN pip install playwright && \
    playwright install --with-deps chromium

# Copy scanner code
COPY . .

# Install Python dependencies
RUN pip install -r requirements.txt

# Default: HTTP server mode (for Railway)
CMD ["python", "main.py"]
ENV SCANNER_MODE=http