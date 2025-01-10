import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom'; 
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts';
import './StatsModal.css';

const COLORS = ['#4CAF50', '#FFA726', '#42A5F5', '#EF5350', '#AB47BC'];

export default function StatsModal({ isOpen, onClose }) {
    const [selectedCategory, setSelectedCategory] = useState('');
    const [stats, setStats] = useState(null);
    const [graphData, setGraphData] = useState(null);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.classList.add('modal-open');
        } else {
            document.body.classList.remove('modal-open');
        }
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, [isOpen]);

    // Load CSV data
    useEffect(() => {
        const loadData = async () => {
            try {
                const response = await fetch('/social-media-dataset3.csv');
                const csvText = await response.text();
                const rows = csvText.split('\n').slice(1); // Skip header
                
                // Extract unique categories
                const uniqueCategories = [...new Set(rows
                    .map(row => row.split(',')[2]) // content_category is the third column
                    .filter(Boolean))];
                
                setCategories(uniqueCategories);
                console.log('Available categories:', uniqueCategories);
            } catch (error) {
                console.error('Error loading CSV:', error);
            }
        };

        loadData();
    }, []);

    // Process data when category is selected
    useEffect(() => {
        const processData = async () => {
            if (!selectedCategory) return;
            
            setIsLoading(true);
            try {
                const response = await fetch('/social-media-dataset3.csv');
                const csvText = await response.text();
                const rows = csvText.split('\n').slice(1); // Skip header
                
                const data = rows.map(row => {
                    const [, , category, , likes, shares, comments, impressions, followers] = row.split(',');
                    return {
                        category: category.trim(),
                        likes: parseInt(likes) || 0,
                        shares: parseInt(shares) || 0,
                        comments: parseInt(comments) || 0,
                        impressions: parseInt(impressions) || 0,
                        followers_gained: parseInt(followers) || 0
                    };
                }).filter(item => Boolean(item.category)); // Remove empty categories

                // Calculate totals for selected category
                const categoryData = data.filter(d => d.category === selectedCategory);
                const totals = {
                    likes: categoryData.reduce((sum, d) => sum + d.likes, 0),
                    shares: categoryData.reduce((sum, d) => sum + d.shares, 0),
                    comments: categoryData.reduce((sum, d) => sum + d.comments, 0),
                    impressions: categoryData.reduce((sum, d) => sum + d.impressions, 0),
                    followers: categoryData.reduce((sum, d) => sum + d.followers_gained, 0)
                };
                setStats(totals);

                // Prepare graph data for all categories
                const graphData = [...new Set(data.map(d => d.category))].map(cat => ({
                    name: cat,
                    impressions: data
                        .filter(d => d.category === cat)
                        .reduce((sum, d) => sum + d.impressions, 0),
                    followers: data
                        .filter(d => d.category === cat)
                        .reduce((sum, d) => sum + d.followers_gained, 0)
                }));
                setGraphData(graphData);

            } catch (error) {
                console.error('Error processing data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        processData();
    }, [selectedCategory]);

    if (!isOpen) return null;

    

    return createPortal(
        <div className="stats-modal-overlay">
            <div className="stats-modal">
                <h2>Compare Engagement</h2>
                <select 
                    value={selectedCategory} 
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="category-select"
                >
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                    ))}
                </select>

                {isLoading && <div className="loading">Loading...</div>}

                {stats && (
                    <div className="stats-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Total Metric</th>
                                    <th>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td>Impressions</td><td>{stats.impressions.toLocaleString()}</td></tr>
                                <tr><td>Likes</td><td>{stats.likes.toLocaleString()}</td></tr>
                                <tr><td>Comments</td><td>{stats.comments.toLocaleString()}</td></tr>
                                <tr><td>Shares</td><td>{stats.shares.toLocaleString()}</td></tr>
                                <tr><td>Followers Gained</td><td>{stats.followers.toLocaleString()}</td></tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {graphData && (
                    <div className="graphs-container">
                        <div className="bar-chart">
                            <h3>Impressions by Category</h3>
                            <BarChart width={500} height={300} data={graphData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="impressions" fill="#4CAF50" />
                            </BarChart>
                        </div>

                        <div className="pie-chart">
                            <h3>Followers Distribution</h3>
                            <PieChart width={400} height={300}>
                                <Pie
                                    data={graphData}
                                    cx={200}
                                    cy={150}
                                    labelLine={false}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="followers"
                                    label={({ name, percent }) => 
                                        `${name}: ${(percent * 100).toFixed(0)}%`
                                    }
                                >
                                    {graphData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </div>
                    </div>
                )}

                <button className="close-button" onClick={onClose}>Close</button>
            </div>
        </div>,
        document.body  // This mounts the modal directly to the body element
    );
}
