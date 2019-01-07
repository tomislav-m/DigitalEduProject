namespace DigObr
{
    using DigObr.Models;
    using System;
    using System.Data.Entity;
    using System.Linq;

    public class Db : DbContext
    {
        // Your context has been configured to use a 'Db' connection string from your application's 
        // configuration file (App.config or Web.config). By default, this connection string targets the 
        // 'DigObr.Db' database on your LocalDb instance. 
        // 
        // If you wish to target a different database and/or database provider, modify the 'Db' 
        // connection string in the application configuration file.
        public Db()
            : base("name=Db")
        {
        }

        // Add a DbSet for each entity type that you want to include in your model. For more information 
        // on configuring and using a Code First model, see http://go.microsoft.com/fwlink/?LinkId=390109.

        public virtual DbSet<User> Users { get; set; }
        public virtual DbSet<Question> Questions { get; set; }
        public virtual DbSet<Answer> Answers { get; set; }
        public virtual DbSet<Subject> Subjects { get; set; }
    }

    //public class MyEntity
    //{
    //    public int Id { get; set; }
    //    public string Name { get; set; }
    //}
}