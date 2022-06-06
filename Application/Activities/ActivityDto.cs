using Application.Profiles;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Application.Activities
{
    public class ActivityDto
    {
        public Guid Id { get; set; }

        public string Title { get; set; } = string.Empty;

        public DateTime Date { get; set; }

        public string Description { get; set; } = String.Empty;

        public string Category { get; set; } = String.Empty;

        public string City { get; set; } = String.Empty;

        public string Venue { get; set; } = String.Empty;

        public string HostUserName { get; set; } = String.Empty;

        public bool IsCancelled { get; set; }

        public ICollection<AttendeeDto> Attendees { get; set; } = new List<AttendeeDto>();
    }
}
