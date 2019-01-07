using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Web.Http;
using DigObr.Models;

namespace DigObr.Controllers
{
    public class QuestionsController : ApiController
    {
        private Db db = new Db();
        
        //lista pitanja
        [ActionName("Primary")]
        public IQueryable<QuestionAndAnswer> GetQuestions(int id)
        {
            List<QuestionAndAnswer> qa = (from q in db.Questions
                                          join a in db.Answers on q.AnswerId equals a.Id
                                          where q.Primary == true && q.SubjectId == id
                                          select new QuestionAndAnswer() { Answer = a.Text, Question = q.Text, AnswerId = a.Id, QuestionId = q.Id }).ToList();
            return qa.AsQueryable();
        }
        
        //neodgovorena pitanja za profesora
        [ActionName("Unanswered")]
        public IQueryable<Question> GetUnansweredQuestions(int id)
        {
            return db.Questions.Where(q => q.AnswerId == null && q.SubjectId == id);
        }
        
        //odgovorena pitanja za studenta
        [ActionName("Answered")]
        public IQueryable<QuestionAndAnswer> GetAnsweredQuestions(string username)
        {
            List<QuestionAndAnswer> qa = (from q in db.Questions
                                          join a in db.Answers on q.AnswerId equals a.Id
                                          where q.Seen == false && q.AskedBy == (from u in db.Users
                                                                                 where u.Username == username
                                                                                 select u.Id).FirstOrDefault()
                                          select new QuestionAndAnswer() { Answer = a.Text, Question = q.Text, AnswerId = a.Id, QuestionId = q.Id }).ToList();
            foreach (var item in qa)
            {
                Question q = db.Questions.Find(item.QuestionId);
                q.Seen = true;
                db.Entry(q).State = EntityState.Modified;
            }
            db.SaveChanges();
            
            return qa.AsQueryable();
        }
        
        //[ResponseType(typeof(Question))]
        //public IHttpActionResult GetQuestion(int id)
        //{
        //    Question question = db.Questions.Find(id);
        //    if (question == null)
        //    {
        //        return NotFound();
        //    }

        //    return Ok(question);
        //}
        
        [ActionName("Edit")]
        public IHttpActionResult PutQuestion(int id, Question question)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != question.Id)
            {
                return BadRequest();
            }

            db.Entry(question).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!QuestionExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return StatusCode(HttpStatusCode.NoContent);
        }

        [ActionName("New")]
        public IHttpActionResult PostQuestion(Question question)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
            
            db.Questions.Add(question);
            db.SaveChanges();
            
            return CreatedAtRoute("DefaultApi", new { id = question.Id }, question);
        }

        [ActionName("Ask")]
        public IHttpActionResult AskQuestion(Question question)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }
           
            Query query = new Query(question.Text);
            if (!query.Intent.Equals("unknown"))
            {
                return Ok(query.Answer);
            }

            question.User = db.Users.Find(question.AskedBy);
            db.Questions.Add(question);
            db.SaveChanges();

            return CreatedAtRoute("DefaultApi", new { id = question.Id }, question);
        }

        [ActionName("Remove")]
        public IHttpActionResult DeleteQuestion(int id)
        {
            Question question = db.Questions.Find(id);
            if (question == null)
            {
                return NotFound();
            }

            db.Questions.Remove(question);
            db.SaveChanges();

            return Ok(question);
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                db.Dispose();
            }
            base.Dispose(disposing);
        }

        private bool QuestionExists(int id)
        {
            return db.Questions.Count(e => e.Id == id) > 0;
        }
    }
}