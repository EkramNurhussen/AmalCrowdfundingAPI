document.addEventListener('DOMContentLoaded', () => {
    console.log('script.js loaded');
    const token = localStorage.getItem('access');
    const authLinks = document.getElementById('auth-links');
    const userLinks = document.getElementById('user-links');
    const logoutButton = document.getElementById('logout');

    console.log('authLinks:', authLinks, 'userLinks:', userLinks);

    // Handle navigation bar based on authentication
    if (token) {
        console.log('Token found, showing user links');
        if (authLinks) authLinks.classList.add('hidden');
        if (userLinks) userLinks.classList.remove('hidden');
    } else {
        console.log('No token, showing auth links');
        if (authLinks) authLinks.classList.remove('hidden');
        if (userLinks) userLinks.classList.add('hidden');
    }

    // Logout functionality
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            console.log('Logout clicked');
            localStorage.removeItem('access');
            localStorage.removeItem('refresh');
            window.location.href = '/login/';
        });
    }

    // Load categories for dropdowns
    async function loadCategories(selectElementId) {
        try {
            console.log(`Fetching categories for ${selectElementId}`);
            const response = await fetch('/api/categories/', {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const categories = await response.json();
            const select = document.getElementById(selectElementId);
            if (select) {
                select.innerHTML = '<option value="">Select Category</option>';
                categories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    select.appendChild(option);
                });
            } else {
                console.error(`Select element with ID ${selectElementId} not found`);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            const targetDiv = selectElementId === 'category' ? document.getElementById('campaigns') || document.getElementById('create-campaign-form') : null;
            if (targetDiv) {
                targetDiv.innerHTML += `<p class="text-red-500">Error loading categories: ${error.message}</p>`;
            }
        }
    }

    // Register form
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(registerForm);
            const data = {
                username: formData.get('username'),
                email: formData.get('email'),
                password: formData.get('password'),
                is_creator: formData.get('is_creator') === 'on'
            };
            try {
                const response = await fetch('/api/register/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Registration successful! Please login.');
                    window.location.href = '/login/';
                } else {
                    alert('Error: ' + JSON.stringify(result));
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        console.log('Login form detected');
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            console.log('Login form submitted');
            const formData = new FormData(loginForm);
            const data = {
                username: formData.get('username'),
                password: formData.get('password')
            };
            try {
                console.log('Sending POST to /api/login/ with:', data);
                const response = await fetch('/api/login/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok) {
                    console.log('Login successful, storing tokens:', result);
                    localStorage.setItem('access', result.access);
                    localStorage.setItem('refresh', result.refresh);
                    window.location.href = '/'; // Redirect to home
                } else {
                    console.error('Login failed:', result);
                    alert('Error: ' + JSON.stringify(result));
                }
            } catch (error) {
                console.error('Login error:', error);
                alert('Error: ' + error.message);
            }
        });
    }

    // Profile form
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
        fetch('/api/profile/', {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            if (!response.ok) throw new Error('Failed to fetch profile');
            return response.json();
        }).then(data => {
            document.getElementById('bio').value = data.bio || '';
            document.getElementById('is_creator').checked = data.is_creator;
        }).catch(error => {
            console.error('Profile error:', error);
            alert('Error loading profile: ' + error.message);
        });
        profileForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(profileForm);
            const data = {
                bio: formData.get('bio'),
                is_creator: formData.get('is_creator') === 'on'
            };
            try {
                const response = await fetch('/api/profile/', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Profile updated!');
                } else {
                    alert('Error: ' + JSON.stringify(result));
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    // Campaigns list and filter
    if (window.location.pathname === '/dashboard/') {
        const campaignsDiv = document.getElementById('campaigns');
        const searchInput = document.getElementById('search');
        const categorySelect = document.getElementById('category');

        // Load categories for dashboard
        loadCategories('category');

        // Load campaigns
        const loadCampaigns = async () => {
            const search = searchInput.value;
            const category = categorySelect.value;
            let url = '/api/campaigns/';
            if (search || category) {
                url += '?';
                if (search) url += `search=${encodeURIComponent(search)}&`;
                if (category) url += `category=${category}`;
            }
            try {
                console.log('Fetching campaigns:', url);
                const headers = { 'Content-Type': 'application/json' };
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }
                const response = await fetch(url, { headers });
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const campaigns = await response.json();
                campaignsDiv.innerHTML = '';
                if (campaigns.length === 0) {
                    campaignsDiv.innerHTML = '<p class="text-gray-500">No campaigns found.</p>';
                } else {
                    campaigns.forEach(campaign => {
                        const div = document.createElement('div');
                        div.className = 'bg-white p-4 rounded shadow';
                        div.innerHTML = `
                            <h2 class="text-xl font-bold">${campaign.title}</h2>
                            <p>${campaign.description}</p>
                            <p>Goal: $$  {campaign.goal_amount}</p>
                            <p>Raised:   $${campaign.current_amount}</p>
                            <p>Progress: ${campaign.progress.toFixed(2)}%</p>
                            <a href="/campaign/${campaign.id}/" class="text-blue-500 hover:underline">View Details</a>
                        `;
                        campaignsDiv.appendChild(div);
                    });
                }
            } catch (error) {
                console.error('Error loading campaigns:', error);
                campaignsDiv.innerHTML = `<p class="text-red-500">Error loading campaigns: ${error.message}</p>`;
            }
        };

        searchInput.addEventListener('input', loadCampaigns);
        categorySelect.addEventListener('change', loadCampaigns);
        loadCampaigns();
    }

    // Create campaign
    const createCampaignForm = document.getElementById('create-campaign-form');
    if (createCampaignForm) {
        // Load categories for create campaign
        loadCategories('category');

        createCampaignForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(createCampaignForm);
            const data = {
                title: formData.get('title'),
                description: formData.get('description'),
                goal_amount: parseFloat(formData.get('goal_amount')),
                end_date: formData.get('end_date'),
                category: parseInt(formData.get('category'))
            };
            try {
                console.log('Creating campaign:', data);
                const response = await fetch('/api/campaigns/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Campaign created!');
                    window.location.href = '/dashboard/';
                } else {
                    alert('Error: ' + JSON.stringify(result));
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    // Campaign details
    if (window.location.pathname.startsWith('/campaign/')) {
        const campaignId = window.location.pathname.split('/')[2];
        const campaignDetails = document.getElementById('campaign-details');
        const commentsDiv = document.getElementById('comments');
        const deleteButton = document.getElementById('delete-campaign');
        const donateLink = document.getElementById('donate-link');
        const commentLink = document.getElementById('comment-link');

        // Set donate and comment links
        if (donateLink) donateLink.href = `/donate/${campaignId}/`;
        if (commentLink) commentLink.href = `/comment/${campaignId}/`;

        // Load campaign details
        fetch(`/api/campaigns/${campaignId}/`, {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            if (!response.ok) throw new Error('Failed to fetch campaign');
            return response.json();
        }).then(campaign => {
            campaignDetails.innerHTML = `
                <h2 class="text-2xl font-bold">${campaign.title}</h2>
                <p>${campaign.description}</p>
                <p>Goal: $$  {campaign.goal_amount}</p>
                <p>Raised:   $${campaign.current_amount}</p>
                <p>Progress: ${campaign.progress.toFixed(2)}%</p>
                <p>Created by: ${campaign.creator}</p>
                <p>Ends: ${campaign.end_date}</p>
            `;
            // Show delete button if user is creator
            if (token) {
                fetch('/api/profile/', {
                    headers: { 'Authorization': `Bearer ${token}` }
                }).then(response => response.json()).then(profile => {
                    if (profile.username === campaign.creator) {
                        deleteButton.classList.remove('hidden');
                    }
                });
            }
        }).catch(error => {
            console.error('Campaign details error:', error);
            campaignDetails.innerHTML = `<p class="text-red-500">Error loading campaign: ${error.message}</p>`;
        });

        // Load comments
        fetch(`/api/comments/?campaign=${campaignId}`).then(response => response.json()).then(comments => {
            commentsDiv.innerHTML = '';
            comments.forEach(comment => {
                const div = document.createElement('div');
                div.className = 'bg-white p-4 rounded shadow mb-2';
                div.innerHTML = `
                    <p><strong>${comment.user}</strong> on ${new Date(comment.created_at).toLocaleString()}</p>
                    <p>${comment.content}</p>
                `;
                commentsDiv.appendChild(div);
            });
        }).catch(error => {
            console.error('Comments error:', error);
            commentsDiv.innerHTML = `<p class="text-red-500">Error loading comments: ${error.message}</p>`;
        });

        // Delete campaign
        if (deleteButton) {
            deleteButton.addEventListener('click', async () => {
                if (confirm('Are you sure you want to delete this campaign?')) {
                    try {
                        const response = await fetch(`/api/campaigns/${campaignId}/`, {
                            method: 'DELETE',
                            headers: { 'Authorization': `Bearer ${token}` }
                        });
                        if (response.ok) {
                            alert('Campaign deleted!');
                            window.location.href = '/dashboard/';
                        } else {
                            alert('Error: Unable to delete campaign');
                        }
                    } catch (error) {
                        alert('Error: ' + error.message);
                    }
                }
            });
        }
    }

    // Donate form
    const donateForm = document.getElementById('donate-form');
    if (donateForm) {
        const campaignId = window.location.pathname.split('/')[2];
        const campaignDetails = document.getElementById('campaign-details');
        fetch(`/api/campaigns/${campaignId}/`).then(response => {
            if (!response.ok) throw new Error('Failed to fetch campaign');
            return response.json();
        }).then(campaign => {
            campaignDetails.innerHTML = `
                <h2 class="text-2xl font-bold">${campaign.title}</h2>
                <p>Raised: $$  {campaign.current_amount} of   $${campaign.goal_amount}</p>
            `;
        }).catch(error => {
            console.error('Donate form error:', error);
            campaignDetails.innerHTML = `<p class="text-red-500">Error loading campaign: ${error.message}</p>`;
        });
        donateForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(donateForm);
            const data = {
                amount: parseFloat(formData.get('amount')),
                anonymous: formData.get('anonymous') === 'on'
            };
            try {
                const response = await fetch(`/api/campaigns/${campaignId}/donate/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Donation successful!');
                    window.location.href = `/campaign/${campaignId}/`;
                } else {
                    alert('Error: ' + JSON.stringify(result));
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    // Comment form
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        const campaignId = window.location.pathname.split('/')[2];
        const campaignDetails = document.getElementById('campaign-details');
        fetch(`/api/campaigns/${campaignId}/`).then(response => {
            if (!response.ok) throw new Error('Failed to fetch campaign');
            return response.json();
        }).then(campaign => {
            campaignDetails.innerHTML = `
                <h2 class="text-2xl font-bold">${campaign.title}</h2>
                <p>Raised: $$  {campaign.current_amount} of   $${campaign.goal_amount}</p>
            `;
        }).catch(error => {
            console.error('Comment form error:', error);
            campaignDetails.innerHTML = `<p class="text-red-500">Error loading campaign: ${error.message}</p>`;
        });
        commentForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(commentForm);
            const data = {
                campaign: parseInt(campaignId),
                content: formData.get('content')
            };
            try {
                const response = await fetch('/api/comments/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(data)
                });
                const result = await response.json();
                if (response.ok) {
                    alert('Comment added!');
                    window.location.href = `/campaign/${campaignId}/`;
                } else {
                    alert('Error: ' + JSON.stringify(result));
                }
            } catch (error) {
                alert('Error: ' + error.message);
            }
        });
    }

    // Backer history
    if (window.location.pathname === '/backer_history/') {
        const backerHistoryDiv = document.getElementById('backer-history');
        console.log('Fetching backer history');
        fetch('/api/backer-history/', {
            headers: { 'Authorization': `Bearer ${token}` }
        }).then(response => {
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return response.json();
        }).then(donations => {
            backerHistoryDiv.innerHTML = '';
            if (donations.length === 0) {
                backerHistoryDiv.innerHTML = '<p class="text-gray-500">No donation history found.</p>';
            } else {
                donations.forEach(donation => {
                    const div = document.createElement('div');
                    div.className = 'bg-white p-4 rounded shadow';
                    div.innerHTML = `
                        <p>Campaign ID: ${donation.campaign}</p>
                        <p>Amount: $${donation.amount}</p>
                        <p>Anonymous: ${donation.anonymous ? 'Yes' : 'No'}</p>
                        <p>Date: ${new Date(donation.created_at).toLocaleString()}</p>
                    `;
                    backerHistoryDiv.appendChild(div);
                });
            }
        }).catch(error => {
            console.error('Error loading backer history:', error);
            backerHistoryDiv.innerHTML = `<p class="text-red-500">Error loading donation history: ${error.message}</p>`;
        });
    }
});