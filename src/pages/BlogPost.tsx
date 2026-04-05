import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost, Comment } from '../types';
import { getPostBySlug, getCommentsByPostId, addComment } from '../services/api';
import { Loader2, ArrowLeft, Calendar, MessageSquare, User } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Comment form state
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentContent, setNewCommentContent] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchPostAndComments = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const postData = await getPostBySlug(slug);
        setPost(postData);
        if (postData) {
          const commentsData = await getCommentsByPostId(postData.id);
          setComments(commentsData);
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [slug]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!post || !newCommentName.trim() || !newCommentContent.trim()) return;

    setIsSubmittingComment(true);
    try {
      const newComment = await addComment(post.id, newCommentName, newCommentContent);
      setComments([...comments, newComment]);
      setNewCommentName('');
      setNewCommentContent('');
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Article not found</h2>
        <Link to="/blog" className="text-blue-600 hover:text-blue-800 flex items-center justify-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="bg-white min-h-screen pb-24">
      {/* Hero Image */}
      {post.featured_image_url && (
        <div className="w-full h-64 md:h-96 relative bg-gray-900">
          <img 
            src={post.featured_image_url} 
            alt={post.title.rendered}
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="max-w-3xl mx-auto px-4 text-center">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow-md">
                {post.title.rendered}
              </h1>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <Link to="/blog" className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to all articles
        </Link>

        {!post.featured_image_url && (
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-6">
            {post.title.rendered}
          </h1>
        )}

        <div className="flex items-center text-sm text-gray-500 mb-10 pb-10 border-b border-gray-200">
          <Calendar className="w-5 h-5 mr-2" />
          <time dateTime={post.date}>
            {new Date(post.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </time>
        </div>

        <div 
          className="prose prose-lg prose-blue max-w-none text-gray-700 mb-16"
          dangerouslySetInnerHTML={{ __html: post.content.rendered }}
        />

        {/* Comments Section */}
        <div className="border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-8 flex items-center">
            <MessageSquare className="w-6 h-6 mr-3 text-blue-600" />
            Comments ({comments.length})
          </h2>

          {/* Comment List */}
          <div className="space-y-8 mb-12">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mr-4">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{comment.author_name}</h4>
                      <time className="text-sm text-gray-500" dateTime={comment.date}>
                        {new Date(comment.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </time>
                    </div>
                  </div>
                  <p className="text-gray-700 whitespace-pre-wrap">{comment.content}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>

          {/* Add Comment Form */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Leave a comment</h3>
            <form onSubmit={handleCommentSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                  Comment <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="comment"
                  required
                  rows={4}
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  className="block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm px-4 py-2 border"
                  placeholder="Share your thoughts..."
                />
              </div>
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmittingComment}
                  className="inline-flex items-center justify-center px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmittingComment ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Posting...
                    </>
                  ) : (
                    'Post Comment'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </article>
  );
};
