import { useState, useMemo, useEffect } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { MdArrowOutward, MdSearch, MdFilterList } from "react-icons/md";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { axiosPublic } from "../../../api/axios";

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category?: string;
  helpfulCount?: number;
}

interface FAQProps {
  limit?: number;
  showSearch?: boolean;
  showCategories?: boolean;
  sortBy?: "order" | "helpful";
  title?: string;
  subtitle?: string;
}

const FAQ: React.FC<FAQProps> = ({
  limit = 10,
  showSearch = true,
  showCategories = true,
  sortBy = "order",
  title = "Frequently Asked Questions",
}) => {
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [votedIds, setVotedIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("faq_votes");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("faq_votes", JSON.stringify(votedIds));
  }, [votedIds]);

  // Fetch Categories
  const { data: categories = [] } = useQuery<string[]>({
    queryKey: ["faq-categories"],
    queryFn: async () => {
      const res = await axiosPublic.get("/faqs/categories");
      return res.data.data;
    },
    enabled: showCategories,
  });

  const allCategories = useMemo(() => ["All", ...categories], [categories]);

  // Infinite Query for FAQs
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ["faqs", selectedCategory, searchQuery, sortBy, limit],
    queryFn: async ({ pageParam = 1 }) => {
      const categoryParam =
        selectedCategory === "All" ? "" : `&category=${selectedCategory}`;
      const searchParam = searchQuery ? `&search=${searchQuery}` : "";
      const sortParam = `&sortBy=${sortBy}`;
      const res = await axiosPublic.get(
        `/faqs?page=${pageParam}&limit=${limit}${categoryParam}${searchParam}${sortParam}`,
      );
      return res.data;
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
  });

  const faqs = useMemo<FAQItem[]>(
    () => data?.pages.flatMap((page) => page.data) || [],
    [data],
  );

  const toggleFAQ = (id: string) => {
    setActiveIndex(activeIndex === id ? null : id);
  };

  const handleHelpful = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (votedIds.includes(id)) return;

    try {
      await axiosPublic.patch(`/faqs/${id}/helpful`);
      setVotedIds((prev) => [...prev, id]);
    } catch (error: unknown) {
      if ((error as { response?: { status?: number } }).response?.status === 400) {
        setVotedIds((prev) => [...prev, id]);
      }
      console.error("Failed to vote", error);
    }
  };

  useEffect(() => {
    setActiveIndex(null);
  }, [selectedCategory, searchQuery]);

  if (isError) {
    return (
      <div className="py-20 text-center">
        <p className="text-red-500 font-bold">
          Failed to load FAQs. Please try again later.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 text-[#1E5AA8] underline"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <section className="max-w-7xl mx-auto px-6 py-16 font-urbanist">
      <div
        className={`flex flex-col gap-12 ${limit < 10 ? "lg:flex-row" : ""}`}
      >
        {/* Header Section - Left Side on Landing Page */}
        <div
          className={`${limit < 10 ? "lg:w-1/3" : "w-full text-center mb-16"} space-y-6`}
        >
          <div className="space-y-4">
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black text-[#0B0F19] tracking-tight leading-[1.1]"
            >
              {title.split(" ").map((word, i) => (
                <span
                  key={i}
                  className={word === "Questions" ? "text-[#1E5AA8]" : ""}
                >
                  {word}{" "}
                </span>
              ))}
            </motion.h2>
          </div>

          {/* Support Visual - Only for landing page */}
          {limit < 10 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative hidden lg:block"
            >
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-100 group">
                <img
                  src="/images/faq_support.png"
                  alt="Customer Support"
                  className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-4 -right-4 bg-white p-4 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center text-[#2E7D32]">
                  <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                  </svg>
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    Active Support
                  </p>
                  <p className="text-sm font-bold text-slate-900">
                    24/7 Available
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          {/* View All CTA - Only for landing page */}
          {limit < 10 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="pt-4"
            >
              <a
                href="/faqs"
                className="inline-flex items-center gap-3 px-8 py-4 bg-[#0B0F19] text-white font-bold rounded-2xl hover:bg-[#1E5AA8] transition-all duration-300 shadow-xl shadow-black/5 group"
              >
                Explore All Questions
                <MdArrowOutward
                  size={20}
                  className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
                />
              </a>
            </motion.div>
          )}
        </div>

        {/* Content Section - Right Side on Landing Page */}
        <div
          className={`flex-1 ${limit < 10 ? "" : "max-w-4xl mx-auto w-full"}`}
        >
          {/* Filters & Search - Hidden on landing page per user request to save space */}
          {(showSearch || showCategories) && (
            <div className="flex flex-col gap-6 mb-12">
              {showCategories && categories.length > 0 && (
                <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
                  <div className="flex items-center gap-2 text-gray-400 mr-2">
                    <MdFilterList size={20} />
                    <span className="text-sm font-bold uppercase tracking-wider">
                      Topics
                    </span>
                  </div>
                  {allCategories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-6 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-300 ${
                        selectedCategory === category
                          ? "bg-[#1E5AA8] text-white shadow-lg shadow-[#1E5AA8]/20"
                          : "bg-gray-50 text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              )}

              {showSearch && (
                <div className="relative group">
                  <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#1E5AA8] transition-colors">
                    <MdSearch size={24} />
                  </div>
                  <input
                    type="text"
                    placeholder="Search for answers..."
                    className="w-full pl-14 pr-6 py-4 rounded-2xl border-2 border-gray-100 bg-gray-50/50 focus:bg-white focus:border-[#1E5AA8] focus:ring-4 focus:ring-[#1E5AA8]/5 outline-none transition-all text-gray-700 font-medium placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              )}
            </div>
          )}

          {/* FAQ List */}
          <div className="space-y-4">
            {isLoading ? (
              [...Array(limit)].map((_, i) => (
                <div
                  key={i}
                  className="h-20 bg-gray-100 rounded-2xl animate-pulse"
                />
              ))
            ) : faqs.length > 0 ? (
              faqs.map((faq, index) => (
                <motion.div
                  layout
                  key={faq._id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`group border-2 transition-all duration-500 rounded-2xl overflow-hidden ${
                    activeIndex === faq._id
                      ? "border-[#1E5AA8] bg-white shadow-xl shadow-[#1E5AA8]/5"
                      : "border-gray-100 bg-white hover:border-gray-200"
                  }`}
                >
                  <button
                    className="w-full flex justify-between items-center p-6 text-left focus:outline-none"
                    onClick={() => toggleFAQ(faq._id)}
                  >
                    <div className="flex items-center gap-4">
                      <span
                        className={`text-lg font-black transition-colors duration-300 ${
                          activeIndex === faq._id
                            ? "text-[#1E5AA8]"
                            : "text-gray-400"
                        }`}
                      >
                        {(index + 1).toString().padStart(2, "0")}
                      </span>
                      <h3
                        className={`text-lg font-bold transition-colors duration-300 ${
                          activeIndex === faq._id
                            ? "text-[#0B0F19]"
                            : "text-gray-700"
                        }`}
                      >
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className={`p-2 rounded-xl transition-all duration-500 ${
                        activeIndex === faq._id
                          ? "bg-[#1E5AA8] text-white rotate-180"
                          : "bg-gray-50 text-gray-400 group-hover:bg-gray-100"
                      }`}
                    >
                      <ChevronDownIcon className="h-5 w-5" />
                    </div>
                  </button>

                  <AnimatePresence>
                    {activeIndex === faq._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{
                          duration: 0.4,
                          ease: [0.04, 0.62, 0.23, 0.98],
                        }}
                      >
                        <div className="p-6 pt-0 ml-12">
                          <div className="h-px w-full bg-gray-100 mb-6" />
                          <p className="text-gray-600 leading-relaxed font-medium mb-6">
                            {faq.answer}
                          </p>

                          <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">
                              Was this helpful?
                            </span>
                            <button
                              onClick={(e) => handleHelpful(faq._id, e)}
                              disabled={votedIds.includes(faq._id)}
                              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                                votedIds.includes(faq._id)
                                  ? "bg-[#2E7D32]/10 text-[#2E7D32]"
                                  : "bg-gray-50 text-gray-500 hover:bg-[#1E5AA8]/10 hover:text-[#1E5AA8]"
                              }`}
                            >
                              {votedIds.includes(faq._id)
                                ? "Thank you!"
                                : "Yes, it was"}
                              <span className="opacity-50">|</span>
                              <span>
                                {votedIds.includes(faq._id)
                                  ? (faq.helpfulCount || 0) + 1
                                  : (faq.helpfulCount || 0)}
                              </span>
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-20 bg-gray-50 rounded-[2.5rem] border-2 border-dashed border-gray-100">
                <p className="text-gray-400 font-bold text-xl mb-2">
                  No answers found
                </p>
              </div>
            )}

            {/* Load More Button */}
            {hasNextPage && limit >= 10 && (
              <div className="text-center pt-10">
                <button
                  onClick={() => fetchNextPage()}
                  disabled={isFetchingNextPage}
                  className="px-10 py-4 bg-white border-2 border-gray-100 text-[#0B0F19] font-black uppercase tracking-widest text-xs rounded-2xl hover:border-[#1E5AA8] hover:text-[#1E5AA8] transition-all duration-300 disabled:opacity-50"
                >
                  {isFetchingNextPage
                    ? "Loading more..."
                    : "Load More Questions"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer CTA - Only for dedicated page */}
      {limit >= 10 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <div className="inline-flex flex-col sm:flex-row items-center justify-center gap-6 p-8 rounded-[2.5rem] bg-gray-50 border border-gray-100 w-full max-w-3xl mx-auto">
            <div className="text-left">
              <h4 className="text-xl font-bold text-[#0B0F19]">
                Still have questions?
              </h4>
              <p className="text-gray-500 font-medium">
                Can't find the answer you're looking for?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button className="px-8 py-4 bg-[#1E5AA8] text-white font-bold rounded-2xl shadow-lg shadow-[#1E5AA8]/20 hover:bg-[#164a8c] hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                Contact Support
                <MdArrowOutward size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </section>
  );
};

export default FAQ;
