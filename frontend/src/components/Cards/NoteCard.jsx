import React from "react";
import { FaTags } from "react-icons/fa6";
import { MdCreate, MdDelete, MdOutlinePushPin } from "react-icons/md";
import moment from "moment";

const NoteCard = ({
  title,
  date,
  content,
  tags,
  isPinned,
  onPinNote,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="border rounded-xl p-4 bg-white hover:shadow-xl transition-all ease-in-out">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-semibold text-gray-800">{title}</h6>
          <span className="text-xs text-green-700">
            {moment(date).format("Do MMM YYYY")}
          </span>
        </div>

        {/* Pin Icon */}
        <button onClick={onPinNote} title={isPinned ? "Unpin" : "Pin"}>
          <MdOutlinePushPin
            className={`text-xl ${isPinned ? "text-blue-500" : "text-gray-400"}`}
          />
        </button>
      </div>

      {/* Content */}
      <p className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">
        {content?.slice(0, 100)}...
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between mt-3">
        {/* Tags */}
        <div className="flex flex-wrap gap-1 text-xs text-orange-600">
          {tags.map((tag, index) => (
            <span key={index} className="bg-orange-100 px-2 py-0.5 rounded-full">
              #{tag}
            </span>
          ))}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button onClick={onEdit} title="Edit">
            <MdCreate className="text-lg text-blue-500" />
          </button>
          <button onClick={onDelete} title="Delete">
            <MdDelete className="text-lg text-red-500" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
