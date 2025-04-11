"use client";

import { use, useEffect, useState } from 'react';
import { getData, serverURL } from '@/app/services/FetchNodeServices';

const BlogDetail = ({ params }) => {
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const { id } = use(params); // Getting the dynamic ID from URL

    useEffect(() => {
        if (!id) return;

        const fetchBlogData = async () => {
            try {
                const response = await getData(`api/blogs/get-blog-by-id/${id}`);
                console.log(response)
                const blogData = await response?.blog;
                setBlog(blogData);
            } catch (error) {
                console.error("Failed to fetch blog data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchBlogData();
    }, [id]);

    if (loading) return <p>Loading...</p>;

    if (!blog) return <p>Blog not found</p>;

    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#f9f9f9', padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '10px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
                <h1 style={{ fontSize: '36px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>{blog.blogTitle}</h1>

                {/* Displaying the Blog Image */}
                <div style={{ marginBottom: '30px' }}>
                    <img
                        src={`${serverURL}/${blog?.blogImage}`} // Assuming image path is relative to public directory
                        alt={blog.blogTitle}
                        width={800}
                        height={400}
                        layout="responsive"
                        objectFit="cover"
                        style={{ borderRadius: '10px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
                    />
                </div>

                {/* Blog description */}
                <h1 style={{ fontSize: '36px', fontWeight: '600', color: '#333', marginBottom: '20px' }}>{blog.name}</h1>

                <div
                    style={{ lineHeight: '1.8', fontSize: '18px', color: '#555', marginBottom: '30px', padding: '0 10px', textAlign: 'justify', }}
                    dangerouslySetInnerHTML={{ __html: blog.description }} 
                />
                {/* Displaying Date */}
                <div style={{ fontSize: '14px', color: '#888', marginTop: '20px' }}>
                    <p><strong>Published On:</strong> {new Date(blog.date).toLocaleDateString()}</p>
                </div>
            </div>
        </div>
    );
};

export default BlogDetail;
