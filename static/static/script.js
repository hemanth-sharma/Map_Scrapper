document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('queryForm');
    const downloadSection = document.getElementById('downloadSection');
    const downloadBtn = document.getElementById('downloadBtn');
    const loader = document.getElementById('loader');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Show loader and hide download section
        loader.classList.remove('hidden');
        downloadSection.classList.add('hidden');
        
        const formData = {
            query: form.query.value,
            city: form.city.value,
            country: form.country.value
        };

        try {
            const response = await fetch('/process', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const blob = await response.blob();
            
            // Create object URL for the blob
            const url = window.URL.createObjectURL(blob);
            
            // Configure download button
            downloadBtn.onclick = () => {
                const a = document.createElement('a');
                a.href = url;
                a.download = 'generated-report.xlsx'; // Default filename
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            };

            // Hide loader and show download section
            loader.classList.add('hidden');
            downloadSection.classList.remove('hidden');

        } catch (error) {
            console.error('Error:', error);
            loader.classList.add('hidden');
            
            // Show error message
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error';
            errorDiv.textContent = 'An error occurred while processing your request. Please try again.';
            form.appendChild(errorDiv);
            
            // Remove error message after 5 seconds
            setTimeout(() => {
                errorDiv.remove();
            }, 5000);
        }
    });
});