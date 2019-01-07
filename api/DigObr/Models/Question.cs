using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Web;

namespace DigObr.Models
{
    public class Question
    {
        [Key]
        public int Id { get; set; }
        [Required]
        public string Text { get; set; }
        public bool Primary { get; set; } = false;
        public bool Seen { get; set; }

        [ForeignKey("Subject")]
        public int SubjectId { get; set; }
        public virtual Subject Subject { get; set; }

        [ForeignKey("User")]
        public int? AskedBy { get; set; }
        public virtual User User { get; set; }

        [ForeignKey("Answer")]
        public int? AnswerId { get; set; }
        public virtual Answer Answer { get; set; }
    }
}