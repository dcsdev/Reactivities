using Domain;
using FluentValidation;

namespace Application.Activities
{
    public class ActivityValidator : AbstractValidator<Activity>
    {
        public ActivityValidator()
        {
            RuleFor(act => act.Title).NotEmpty();
            RuleFor(act => act.Category).NotEmpty();
            RuleFor(act => act.City).NotEmpty();
            RuleFor(act => act.Date).NotEmpty();
            RuleFor(act => act.Description).NotEmpty();
            RuleFor(act => act.Venue).NotEmpty();
        }
    }
}