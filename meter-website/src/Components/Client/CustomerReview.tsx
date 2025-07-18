import { useState } from "react";
import { Star } from "lucide-react";

const mockReviews = [
  {
    name: "Arjun Nair",
    date: "March 12, 2024",
    rating: 5,
    comment: "Fast service! My digital meter looks new and works perfectly.",
    photo: "/images/reviews/meter1.jpg", // Optional photo
  },
  {
    name: "Sneha P",
    date: "April 5, 2024",
    rating: 4,
    comment: "Display was replaced neatly. A bit delayed, but quality is good.",
    photo: null,
  },
];

const CustomerReviews = () => {
  const [form, setForm] = useState({ name: "", comment: "", rating: 0 });

  const averageRating =
    mockReviews.reduce((sum, r) => sum + r.rating, 0) / mockReviews.length;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Post to backend here
    alert("Review submitted!");
    setForm({ name: "", comment: "", rating: 0 });
  };

  return (
    <div className="mt-10">
      {/* Average Rating */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold">Customer Reviews</h3>
        <div className="flex items-center gap-2 mt-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-5 h-5 ${
                i < Math.round(averageRating) ? "text-yellow-400" : "text-gray-300"
              }`}
              fill={i < Math.round(averageRating) ? "currentColor" : "none"}
            />
          ))}
          <span className="text-sm text-gray-600 ml-2">
            {averageRating.toFixed(1)} out of 5 ({mockReviews.length} reviews)
          </span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-6">
        {mockReviews.map((review, idx) => (
          <div key={idx} className="border border-gray-300 p-4 rounded-lg shadow-sm bg-white">
            <div className="flex items-center justify-between mb-1">
              <p className="font-medium">{review.name}</p>
              <span className="text-sm text-gray-500">{review.date}</span>
            </div>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < review.rating ? "text-yellow-400" : "text-gray-300"
                  }`}
                  fill={i < review.rating ? "currentColor" : "none"}
                />
              ))}
            </div>
            <p className="text-sm text-gray-700">{review.comment}</p>
            {review.photo && (
              <img
                src={review.photo}
                alt="Review"
                className="mt-2 rounded-md w-32 h-20 object-cover"
              />
            )}
          </div>
        ))}
      </div>

      {/* Write a Review Form */}
      <div className="mt-8 border-t border-gray-300 pt-6">
        <h4 className="text-lg font-semibold mb-4">Write a Review</h4>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            required
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          />
          <textarea
            placeholder="Your review"
            required
            value={form.comment}
            onChange={(e) => setForm({ ...form, comment: e.target.value })}
            className="w-full border border-gray-300 rounded-lg p-2 text-sm"
          ></textarea>

          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">Rating:</label>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 cursor-pointer ${
                  i < form.rating ? "text-yellow-400" : "text-gray-300"
                }`}
                fill={i < form.rating ? "currentColor" : "none"}
                onClick={() => setForm({ ...form, rating: i + 1 })}
              />
            ))}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default CustomerReviews;
