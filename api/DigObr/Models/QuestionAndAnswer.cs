using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace DigObr.Models
{
    public class QuestionAndAnswer
    {
        public int QuestionId { get; set; }
        public string Question { get; set; }
        public int AnswerId { get; set; }
        public string Answer { get; set; }
    }
}