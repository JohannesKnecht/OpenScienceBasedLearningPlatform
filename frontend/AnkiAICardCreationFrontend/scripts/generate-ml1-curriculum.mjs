import { readFileSync, writeFileSync } from 'node:fs'

const path = 'src/content/curriculum.json'
const curriculum = JSON.parse(readFileSync(path, 'utf8'))

const track = {
  id: 'machine-learning-foundations',
  title: 'Machine Learning Foundations',
  tagline: 'A math-ready first course in modeling, prediction, evaluation, and responsible ML practice.',
  description: 'An original ML1 course for learners who already have the programming and mathematics needed to focus directly on machine learning.',
  courseIds: ['ml1-machine-learning-foundations'],
  tags: ['ml1', 'machine-learning', 'modeling']
}

const modules = [
  {
    id: 'ml1-problem-framing',
    badge: 'ML1 Module 01',
    title: 'Problem Framing',
    summary: 'Turn real-world questions into learnable tasks with examples, features, labels, and clear evaluation goals.',
    lessons: ['ml1-define-learning-problems', 'ml1-supervised-unsupervised-tasks', 'ml1-model-workflow']
  },
  {
    id: 'ml1-data-and-features',
    badge: 'ML1 Module 02',
    title: 'Data and Features',
    summary: 'Prepare machine-learning datasets while avoiding leakage, representation mistakes, and misleading data quality assumptions.',
    lessons: ['ml1-dataset-splits', 'ml1-feature-representation', 'ml1-data-quality']
  },
  {
    id: 'ml1-linear-regression',
    badge: 'ML1 Module 03',
    title: 'Linear Regression and Optimization',
    summary: 'Use linear models, loss functions, gradients, and scaling to understand supervised prediction.',
    lessons: ['ml1-linear-model-predictions', 'ml1-loss-functions', 'ml1-gradient-descent', 'ml1-feature-scaling']
  },
  {
    id: 'ml1-classification',
    badge: 'ML1 Module 04',
    title: 'Classification and Metrics',
    summary: 'Predict classes, choose thresholds, and evaluate classifier behavior beyond raw accuracy.',
    lessons: ['ml1-logistic-model', 'ml1-decision-thresholds', 'ml1-confusion-matrix', 'ml1-classification-metrics']
  },
  {
    id: 'ml1-generalization',
    badge: 'ML1 Module 05',
    title: 'Generalization and Model Selection',
    summary: 'Diagnose underfitting and overfitting, use validation correctly, and select models without fooling yourself.',
    lessons: ['ml1-overfitting-underfitting', 'ml1-regularization', 'ml1-cross-validation', 'ml1-hyperparameter-tuning']
  },
  {
    id: 'ml1-tree-models',
    badge: 'ML1 Module 06',
    title: 'Tree Models and Ensembles',
    summary: 'Reason about decision trees, their failure modes, and why ensembles often improve stability.',
    lessons: ['ml1-decision-tree-splits', 'ml1-tree-overfitting', 'ml1-ensemble-intuition']
  },
  {
    id: 'ml1-unsupervised-learning',
    badge: 'ML1 Module 07',
    title: 'Unsupervised Learning',
    summary: 'Find structure without labels using clustering, dimensionality reduction, and anomaly detection.',
    lessons: ['ml1-clustering-framing', 'ml1-kmeans-tracing', 'ml1-dimensionality-reduction', 'ml1-anomaly-detection']
  },
  {
    id: 'ml1-neural-networks',
    badge: 'ML1 Module 08',
    title: 'Neural Network Basics',
    summary: 'Understand neurons, layers, activations, and training at the level needed for a first ML course.',
    lessons: ['ml1-neuron-computation', 'ml1-network-architecture', 'ml1-training-neural-networks']
  },
  {
    id: 'ml1-practical-workflow',
    badge: 'ML1 Module 09',
    title: 'Practical ML Workflow',
    summary: 'Connect preprocessing, pipelines, model comparison, and experiment records into a repeatable workflow.',
    lessons: ['ml1-pipelines-and-preprocessing', 'ml1-model-comparison', 'ml1-experiment-tracking']
  },
  {
    id: 'ml1-responsible-projects',
    badge: 'ML1 Module 10',
    title: 'Responsible ML Projects',
    summary: 'Plan end-to-end ML work while accounting for bias, drift, monitoring, and communication.',
    lessons: ['ml1-dataset-bias', 'ml1-model-monitoring', 'ml1-ml-project-plan']
  }
]

const lessons = {
  'ml1-define-learning-problems': {
    title: 'Define learning problems',
    objective: 'Frame a prediction or pattern-discovery task as a machine-learning problem.',
    core: 'A machine-learning problem is not just a dataset. It needs a target behavior, examples, inputs, outputs, and a reason the learned pattern will be useful on future cases.',
    example: 'A hospital wants to estimate appointment no-show risk before reminder messages are sent.',
    steps: ['The example unit is an appointment.', 'Features may include prior attendance, appointment time, and lead time.', 'The label is whether the patient missed the appointment.'],
    method: ['Identify the example unit the model will make one prediction or grouping decision about.', 'List only the input information available when the model would be used.', 'Name the output, target label, or pattern the model is supposed to learn.'],
    question: 'A library wants to predict whether a checked-out book will be returned late. Define the learning problem.',
    solution: 'The example unit is one checkout. The inputs are borrower history, loan length, due date, and book category. The output is whether the book is returned late.',
    skills: [
      ['ml1-identify-learning-problem', 'Identify machine-learning problem types', 'Can decide whether a situation is suitable for supervised, unsupervised, or non-ML analysis.', [], 0.42, ['framing', 'task-selection']],
      ['ml1-map-examples-features-labels', 'Map examples, features, and labels', 'Can identify the example unit, input features, and target label in a supervised-learning task.', ['ml1-identify-learning-problem'], 0.44, ['features', 'labels']]
    ]
  },
  'ml1-supervised-unsupervised-tasks': {
    title: 'Supervised and unsupervised tasks',
    objective: 'Distinguish labeled prediction tasks from unlabeled structure-finding tasks.',
    core: 'Supervised learning uses labels to learn a mapping from inputs to target values. Unsupervised learning looks for useful structure without target labels.',
    example: 'Predicting house price is supervised; grouping homes by similar listing behavior is unsupervised.',
    steps: ['House price prediction has known targets.', 'Grouping homes does not require a target label.', 'The task type controls which methods and metrics make sense.'],
    method: ['Ask whether each training example has a target answer.', 'Classify labeled prediction as supervised and unlabeled structure-finding as unsupervised.', 'Use the task type to choose suitable methods and metrics.'],
    skills: [['ml1-distinguish-ml-task-types', 'Distinguish ML task types', 'Can classify tasks as regression, classification, clustering, anomaly detection, or non-ML.', ['ml1-map-examples-features-labels'], 0.46, ['supervised', 'unsupervised']]]
  },
  'ml1-model-workflow': {
    title: 'Fit, predict, evaluate workflow',
    objective: 'Trace the core ML workflow from training data to predictions and evaluation.',
    core: 'The central workflow is fit on training data, predict on held-out examples, and evaluate with a metric tied to the task goal.',
    example: 'Train a churn classifier on past customers, predict churn risk for validation customers, and score prediction quality.',
    steps: ['Fit uses examples with known outcomes.', 'Predict produces outputs for examples not used for fitting.', 'Evaluate compares predictions with known validation outcomes.'],
    skills: [['ml1-trace-fit-predict-evaluate-workflow', 'Trace fit/predict/evaluate workflows', 'Can explain what data is used at each stage of a basic ML workflow.', ['ml1-distinguish-ml-task-types'], 0.48, ['fit', 'predict', 'evaluate']]]
  },
  'ml1-dataset-splits': {
    title: 'Training, validation, and test splits',
    objective: 'Assign data splits to their correct roles in model development.',
    core: 'Training data fits parameters, validation data guides decisions, and test data estimates final performance after choices are made.',
    example: 'A team tunes a model on validation data, then reports one final score on the untouched test set.',
    steps: ['Training data updates the model.', 'Validation data compares candidate choices.', 'Test data is saved for final estimation.'],
    skills: [['ml1-split-train-validation-test', 'Split train, validation, and test data', 'Can explain the role of each split and avoid using test data during model selection.', ['ml1-trace-fit-predict-evaluate-workflow'], 0.5, ['splits', 'evaluation']]]
  },
  'ml1-feature-representation': {
    title: 'Feature representation and leakage',
    objective: 'Represent useful inputs while detecting information that would not be available at prediction time.',
    core: 'A feature must be available when the model is used. Leakage occurs when training data contains future or target-derived information that makes validation look better than reality.',
    example: 'Using "days until account closed" to predict churn leaks the answer because that value is known only after churn happens.',
    steps: ['Check when each feature becomes known.', 'Remove target-derived or future-only variables.', 'Represent remaining features in a model-ready form.'],
    skills: [
      ['ml1-represent-numeric-categorical-features', 'Represent numerical and categorical features', 'Can choose basic representations for continuous, ordinal, and categorical variables.', ['ml1-split-train-validation-test'], 0.52, ['feature-engineering', 'categorical-data']],
      ['ml1-detect-data-leakage', 'Detect data leakage', 'Can identify features or preprocessing steps that reveal information unavailable at prediction time.', ['ml1-split-train-validation-test'], 0.56, ['leakage', 'validation']]
    ]
  },
  'ml1-data-quality': {
    title: 'Data quality risks',
    objective: 'Identify missingness, outliers, label noise, and distribution mismatch before trusting a model.',
    core: 'ML systems inherit the limits of their data. Missing values, inconsistent labels, and shifted distributions can dominate model behavior.',
    example: 'A fraud dataset collected only from manually reviewed transactions may underrepresent ordinary transactions.',
    steps: ['Inspect how examples were collected.', 'Check whether labels are reliable.', 'Ask whether deployment examples match training examples.'],
    skills: [['ml1-identify-data-quality-risks', 'Identify data quality risks', 'Can name likely data quality issues and explain how they may affect model behavior.', ['ml1-represent-numeric-categorical-features', 'ml1-detect-data-leakage'], 0.58, ['data-quality', 'dataset-shift']]]
  },
  'ml1-linear-model-predictions': {
    title: 'Linear model predictions',
    objective: 'Compute and interpret predictions from a weighted linear model.',
    core: 'A linear model combines feature values with weights and an intercept to produce a prediction score.',
    example: 'A rent model uses size, distance, and age with learned weights to estimate monthly price.',
    steps: ['Multiply each feature by its weight.', 'Add the weighted terms and intercept.', 'Interpret the result as the model prediction.'],
    skills: [['ml1-compute-linear-predictions', 'Compute linear predictions', 'Can calculate and interpret predictions from a linear model expression.', ['ml1-identify-data-quality-risks'], 0.52, ['linear-models', 'prediction']]]
  },
  'ml1-loss-functions': {
    title: 'Loss functions',
    objective: 'Explain how a loss function turns prediction errors into an optimization target.',
    core: 'A loss function measures how bad predictions are. Training searches for parameters that reduce average loss on training examples.',
    example: 'Squared error penalizes a prediction that is far from the target more than one that is only slightly wrong.',
    steps: ['Compare prediction with the target.', 'Compute the example loss.', 'Average losses to score the parameter choice.'],
    skills: [['ml1-interpret-loss-function', 'Interpret loss functions', 'Can explain what a loss function rewards, penalizes, and optimizes.', ['ml1-compute-linear-predictions'], 0.56, ['loss', 'optimization']]]
  },
  'ml1-gradient-descent': {
    title: 'Gradient descent updates',
    objective: 'Trace one optimization update and explain the role of the learning rate.',
    core: 'Gradient descent changes parameters in the direction that most reduces loss locally, scaled by a learning rate.',
    example: 'If increasing a weight raises loss, the next update should move that weight downward.',
    steps: ['Use the gradient sign to choose update direction.', 'Scale the step by the learning rate.', 'Repeat updates until progress slows or stops.'],
    skills: [['ml1-trace-gradient-descent-update', 'Trace gradient descent updates', 'Can reason about update direction, learning rate effects, and convergence risks.', ['ml1-interpret-loss-function'], 0.62, ['gradient-descent', 'learning-rate']]]
  },
  'ml1-feature-scaling': {
    title: 'Feature scaling',
    objective: 'Explain why scale affects optimization and distance-based comparisons.',
    core: 'Features with very different scales can dominate gradients or distance calculations unless they are transformed consistently.',
    example: 'Income measured in dollars can numerically dwarf age measured in years, even when both matter.',
    steps: ['Compare feature magnitudes.', 'Transform training data using fitted scaling values.', 'Apply the same transformation to validation and future data.'],
    skills: [['ml1-explain-feature-scaling', 'Explain feature scaling', 'Can identify when scaling matters and how it should be fit without leakage.', ['ml1-trace-gradient-descent-update', 'ml1-detect-data-leakage'], 0.6, ['scaling', 'preprocessing']]]
  },
  'ml1-logistic-model': {
    title: 'Logistic model outputs',
    objective: 'Interpret logistic regression output as a score suitable for binary classification.',
    core: 'Logistic regression maps a linear score through a sigmoid-shaped transformation so the output can be read as a probability-like value.',
    example: 'A spam model returns 0.82 for one email, meaning the model places it high on the spam side of the decision boundary.',
    steps: ['Compute or inspect the model score.', 'Map the score to an output between 0 and 1.', 'Use a threshold to make a class decision.'],
    skills: [['ml1-interpret-logistic-output', 'Interpret logistic model output', 'Can explain logistic regression scores and probability-like outputs for binary classification.', ['ml1-compute-linear-predictions'], 0.58, ['logistic-regression', 'classification']]]
  },
  'ml1-decision-thresholds': {
    title: 'Decision thresholds',
    objective: 'Explain how changing a threshold changes classifier behavior.',
    core: 'A threshold converts scores into classes. Raising or lowering it changes the tradeoff between false positives and false negatives.',
    example: 'A disease-screening model may use a lower threshold when missing a true case is especially costly.',
    steps: ['Start with predicted scores.', 'Choose a threshold based on the decision cost.', 'Convert scores above or below the threshold into classes.'],
    skills: [['ml1-apply-classification-threshold', 'Apply classification thresholds', 'Can convert scores to class predictions and explain threshold tradeoffs.', ['ml1-interpret-logistic-output'], 0.6, ['thresholds', 'classification']]]
  },
  'ml1-confusion-matrix': {
    title: 'Confusion matrices',
    objective: 'Read true positives, false positives, true negatives, and false negatives from classifier results.',
    core: 'A confusion matrix shows which predicted classes matched reality and which errors the model made.',
    example: 'A positive prediction for an actually negative case is a false positive.',
    steps: ['Identify the actual class.', 'Identify the predicted class.', 'Place the case in the matching confusion-matrix cell.'],
    skills: [['ml1-read-confusion-matrix', 'Read confusion matrices', 'Can identify and interpret the four cells of a binary confusion matrix.', ['ml1-apply-classification-threshold'], 0.62, ['confusion-matrix', 'errors']]]
  },
  'ml1-classification-metrics': {
    title: 'Classification metrics',
    objective: 'Choose between accuracy, precision, recall, and related metrics for a task.',
    core: 'No single metric is best for every classifier. The right metric depends on which errors matter most.',
    example: 'For detecting dangerous defects, recall may matter more than precision because missed defects are expensive.',
    steps: ['Name the costly error type.', 'Choose a metric that exposes that error.', 'Compare models using the chosen metric, not just accuracy.'],
    skills: [['ml1-compare-precision-recall', 'Compare precision and recall', 'Can explain when precision, recall, and accuracy answer different evaluation questions.', ['ml1-read-confusion-matrix'], 0.66, ['precision', 'recall', 'accuracy']]]
  },
  'ml1-overfitting-underfitting': {
    title: 'Overfitting and underfitting',
    objective: 'Diagnose high-bias and high-variance patterns from training and validation behavior.',
    core: 'Underfitting means the model is too weak for the signal. Overfitting means it has adapted too much to training details that do not generalize.',
    example: 'Very low training and validation performance suggests underfitting; excellent training performance but poor validation performance suggests overfitting.',
    steps: ['Compare training and validation metrics.', 'Look for both absolute performance and the gap between splits.', 'Choose a remedy that matches the pattern.'],
    skills: [['ml1-diagnose-overfitting-underfitting', 'Diagnose overfitting and underfitting', 'Can infer underfitting or overfitting from training and validation results.', ['ml1-split-train-validation-test', 'ml1-compare-precision-recall'], 0.66, ['generalization', 'bias-variance']]]
  },
  'ml1-regularization': {
    title: 'Regularization',
    objective: 'Explain how regularization changes model selection pressure.',
    core: 'Regularization adds a preference for simpler or smaller-parameter solutions, often reducing overfitting at the cost of some training fit.',
    example: 'A regularized linear model may accept slightly higher training loss to avoid very large weights.',
    steps: ['Identify the model complexity being penalized.', 'Add the penalty to the training objective.', 'Tune the penalty strength on validation data.'],
    skills: [['ml1-explain-regularization-effect', 'Explain regularization effects', 'Can explain how regularization affects training fit, validation performance, and parameter size.', ['ml1-diagnose-overfitting-underfitting'], 0.7, ['regularization', 'model-complexity']]]
  },
  'ml1-cross-validation': {
    title: 'Cross-validation',
    objective: 'Use repeated train/validation splits to estimate model behavior more reliably.',
    core: 'Cross-validation rotates which fold acts as validation data so performance estimates depend less on one lucky or unlucky split.',
    example: 'Five-fold cross-validation trains five models, each time validating on a different fifth of the data.',
    steps: ['Split data into folds.', 'Train and validate once per fold.', 'Summarize the validation scores.'],
    skills: [['ml1-use-cross-validation', 'Use cross-validation', 'Can describe cross-validation workflow and when it is useful.', ['ml1-explain-regularization-effect'], 0.72, ['cross-validation', 'model-selection']]]
  },
  'ml1-hyperparameter-tuning': {
    title: 'Hyperparameter tuning',
    objective: 'Plan a search over model settings without leaking test information.',
    core: 'Hyperparameters are choices made outside parameter fitting. They should be selected using validation or cross-validation, not the final test set.',
    example: 'Tree depth and regularization strength are hyperparameters because they shape training before parameters are fit.',
    steps: ['Choose a small search space.', 'Score candidates on validation data.', 'Keep the test set untouched until final evaluation.'],
    skills: [['ml1-plan-hyperparameter-search', 'Plan hyperparameter searches', 'Can choose a validation-safe strategy for comparing hyperparameter settings.', ['ml1-use-cross-validation'], 0.74, ['hyperparameters', 'search']]]
  },
  'ml1-decision-tree-splits': {
    title: 'Decision tree splits',
    objective: 'Trace how a decision tree partitions examples with feature tests.',
    core: 'A decision tree predicts by asking a sequence of feature questions that route each example to a leaf.',
    example: 'A tree for loan risk may first split on missed-payment history, then split each branch on income stability.',
    steps: ['Start at the root node.', 'Apply the feature test.', 'Continue through branches until reaching a leaf prediction.'],
    skills: [['ml1-trace-decision-tree-split', 'Trace decision tree splits', 'Can follow feature-based routing through a small decision tree.', ['ml1-distinguish-ml-task-types'], 0.58, ['decision-trees', 'splits']]]
  },
  'ml1-tree-overfitting': {
    title: 'Tree overfitting',
    objective: 'Explain why unrestricted trees can memorize training details.',
    core: 'Deep trees can create tiny leaves that match training examples closely but fail on new examples.',
    example: 'A tree that splits until every training customer has its own leaf may describe noise instead of reusable patterns.',
    steps: ['Inspect leaf size or depth.', 'Compare training and validation metrics.', 'Use constraints or pruning to reduce complexity.'],
    skills: [['ml1-control-tree-complexity', 'Control tree complexity', 'Can identify tree settings that reduce overfitting risk.', ['ml1-trace-decision-tree-split', 'ml1-diagnose-overfitting-underfitting'], 0.7, ['trees', 'overfitting']]]
  },
  'ml1-ensemble-intuition': {
    title: 'Ensemble intuition',
    objective: 'Compare a single tree with an ensemble at a conceptual level.',
    core: 'An ensemble combines multiple models so individual errors can average out or be corrected by later models.',
    example: 'A random forest reduces dependence on one unstable tree by averaging many trees trained with variation.',
    steps: ['Train multiple related models.', 'Combine their predictions.', 'Compare stability with a single model.'],
    skills: [['ml1-compare-single-tree-ensemble', 'Compare single trees and ensembles', 'Can explain why ensembles can improve stability and when they reduce interpretability.', ['ml1-control-tree-complexity'], 0.72, ['ensembles', 'random-forest']]]
  },
  'ml1-clustering-framing': {
    title: 'Clustering problem framing',
    objective: 'Frame an unlabeled grouping problem and choose meaningful inputs.',
    core: 'Clustering groups examples by similarity. The result depends heavily on which features and distance notion represent similarity.',
    example: 'Grouping stores by customer behavior may reveal operational patterns without using a target label.',
    steps: ['Choose the example unit.', 'Select features that express similarity.', 'Interpret clusters as hypotheses, not ground truth labels.'],
    skills: [['ml1-frame-clustering-problem', 'Frame clustering problems', 'Can identify when clustering is appropriate and what representation it depends on.', ['ml1-represent-numeric-categorical-features'], 0.64, ['clustering', 'unsupervised']]]
  },
  'ml1-kmeans-tracing': {
    title: 'Trace k-means iterations',
    objective: 'Trace assignment and centroid-update steps in k-means.',
    core: 'K-means alternates between assigning points to nearest centroids and moving centroids to the mean of assigned points.',
    example: 'After points are assigned to two centroids, each centroid moves to the average location of its assigned points.',
    steps: ['Assign each point to its nearest centroid.', 'Average points in each cluster.', 'Move centroids and repeat.'],
    skills: [['ml1-trace-kmeans-iteration', 'Trace k-means iterations', 'Can follow one assignment/update cycle of k-means clustering.', ['ml1-frame-clustering-problem', 'ml1-explain-feature-scaling'], 0.72, ['k-means', 'centroids']]]
  },
  'ml1-dimensionality-reduction': {
    title: 'Dimensionality reduction intuition',
    objective: 'Explain why projecting data into fewer dimensions can help inspection or modeling.',
    core: 'Dimensionality reduction creates a smaller representation that preserves selected structure while discarding some information.',
    example: 'A two-dimensional embedding of product behavior may reveal groups that are hard to inspect across hundreds of raw features.',
    steps: ['Start with high-dimensional features.', 'Choose a projection objective.', 'Interpret the lower-dimensional view carefully.'],
    skills: [['ml1-interpret-dimensionality-reduction', 'Interpret dimensionality reduction', 'Can explain what dimensionality reduction preserves, loses, and is commonly used for.', ['ml1-frame-clustering-problem'], 0.7, ['dimensionality-reduction', 'representation']]]
  },
  'ml1-anomaly-detection': {
    title: 'Anomaly detection',
    objective: 'Choose anomaly detection when unusual examples matter more than ordinary class prediction.',
    core: 'Anomaly detection looks for examples that are rare under the normal data pattern, especially when labeled anomalies are scarce.',
    example: 'A sensor system may learn normal vibration patterns and flag readings far outside that pattern.',
    steps: ['Define normal behavior.', 'Score how unusual new examples are.', 'Choose an alert threshold based on cost and review capacity.'],
    skills: [['ml1-select-anomaly-detection', 'Select anomaly detection', 'Can decide when anomaly detection is more appropriate than supervised classification.', ['ml1-frame-clustering-problem', 'ml1-apply-classification-threshold'], 0.7, ['anomaly-detection', 'thresholds']]]
  },
  'ml1-neuron-computation': {
    title: 'Neuron computation',
    objective: 'Trace the weighted sum and activation output of a single artificial neuron.',
    core: 'A neuron computes a weighted input sum and passes it through an activation function to produce its output.',
    example: 'A neuron can combine brightness and edge-strength inputs, then pass the result through a nonlinear activation.',
    steps: ['Compute the weighted sum.', 'Add the bias term.', 'Apply the activation function.'],
    skills: [['ml1-trace-neuron-activation', 'Trace neuron activations', 'Can compute or interpret one neuron output from inputs, weights, bias, and activation.', ['ml1-compute-linear-predictions'], 0.68, ['neural-networks', 'activation']]]
  },
  'ml1-network-architecture': {
    title: 'Network architecture',
    objective: 'Map input, hidden, and output layers to their roles in a neural network.',
    core: 'A neural network stacks parameterized transformations. Hidden layers build intermediate representations, and output layers match the task type.',
    example: 'A multiclass image classifier uses hidden layers for learned visual features and an output layer with one score per class.',
    steps: ['Identify the input shape.', 'Follow transformations through hidden layers.', 'Match the output layer to the prediction task.'],
    skills: [['ml1-map-network-layers', 'Map network layers', 'Can explain the roles of input, hidden, activation, and output layers in a simple network.', ['ml1-trace-neuron-activation', 'ml1-distinguish-ml-task-types'], 0.72, ['layers', 'architecture']]]
  },
  'ml1-training-neural-networks': {
    title: 'Training neural networks',
    objective: 'Explain the training loop for neural networks without treating it as magic.',
    core: 'Neural network training alternates forward prediction, loss computation, gradient propagation, and parameter updates.',
    example: 'A batch of examples flows forward through the network; the loss gradient then guides weight updates backward through the layers.',
    steps: ['Run a forward pass.', 'Compute loss.', 'Propagate gradients and update parameters.'],
    skills: [['ml1-explain-neural-training-loop', 'Explain neural training loops', 'Can describe forward pass, loss, gradients, and parameter updates in neural network training.', ['ml1-map-network-layers', 'ml1-trace-gradient-descent-update'], 0.78, ['backpropagation', 'training-loop']]]
  },
  'ml1-pipelines-and-preprocessing': {
    title: 'Pipelines and preprocessing',
    objective: 'Explain why preprocessing should be fit inside the training workflow.',
    core: 'A pipeline keeps preprocessing and prediction steps together so transformations are learned from training data and applied consistently to validation and future examples.',
    example: 'A scaler should learn means and standard deviations from training data, then reuse those values for validation data.',
    steps: ['Fit preprocessing on training data only.', 'Transform validation data with the fitted preprocessing.', 'Fit and evaluate the model through one pipeline.'],
    skills: [
      ['ml1-build-preprocessing-pipeline', 'Build preprocessing pipelines conceptually', 'Can order preprocessing and estimator steps in a repeatable ML workflow.', ['ml1-explain-feature-scaling', 'ml1-represent-numeric-categorical-features'], 0.72, ['pipelines', 'preprocessing']],
      ['ml1-prevent-preprocessing-leakage', 'Prevent preprocessing leakage', 'Can identify preprocessing choices that leak validation or test information.', ['ml1-detect-data-leakage', 'ml1-build-preprocessing-pipeline'], 0.76, ['leakage', 'pipelines']]
    ]
  },
  'ml1-model-comparison': {
    title: 'Model comparison',
    objective: 'Compare candidate models using task-appropriate validation evidence.',
    core: 'Model comparison should use the same split, metric, and decision criteria across candidates.',
    example: 'A logistic model and a tree ensemble can be compared on validation recall if missed positives are the main cost.',
    steps: ['Choose the metric before comparing.', 'Evaluate candidates on the same validation setup.', 'Select based on evidence and constraints.'],
    skills: [['ml1-compare-models-with-validation', 'Compare models with validation evidence', 'Can compare models fairly using consistent splits, metrics, and constraints.', ['ml1-plan-hyperparameter-search', 'ml1-compare-single-tree-ensemble'], 0.78, ['model-selection', 'validation']]]
  },
  'ml1-experiment-tracking': {
    title: 'Experiment tracking',
    objective: 'Record enough information to explain and reproduce a model result.',
    core: 'An experiment record should connect data version, features, model settings, metric, and interpretation.',
    example: 'A useful experiment note says which split, preprocessing, model, hyperparameters, and metric produced the reported score.',
    steps: ['Record data and split identity.', 'Record preprocessing and model settings.', 'Record metrics and conclusions.'],
    skills: [['ml1-record-experiment-result', 'Record experiment results', 'Can specify the minimum record needed to reproduce and interpret an ML experiment.', ['ml1-compare-models-with-validation'], 0.72, ['experiments', 'reproducibility']]]
  },
  'ml1-dataset-bias': {
    title: 'Dataset bias',
    objective: 'Identify dataset bias and representation gaps that may affect deployed behavior.',
    core: 'A model trained on biased or unrepresentative data can produce biased outputs even when the learning algorithm works as designed.',
    example: 'A hiring dataset based only on past hires may encode past screening patterns rather than job-relevant ability.',
    steps: ['Ask who is represented in the data.', 'Ask which historical decisions created the labels.', 'Check whether performance differs across important groups.'],
    skills: [['ml1-identify-dataset-bias', 'Identify dataset bias', 'Can spot collection and labeling patterns that may produce unfair or unreliable model behavior.', ['ml1-identify-data-quality-risks'], 0.7, ['fairness', 'bias']]]
  },
  'ml1-model-monitoring': {
    title: 'Model monitoring and drift',
    objective: 'Explain why model quality must be monitored after deployment.',
    core: 'Model performance can change when data, user behavior, labels, or decision policies change after deployment.',
    example: 'A demand model trained before a supply-chain disruption may fail once buying patterns shift.',
    steps: ['Track input distributions.', 'Track prediction and outcome metrics.', 'Investigate changes before retraining blindly.'],
    skills: [['ml1-detect-model-drift', 'Detect model drift', 'Can identify signs that deployed model behavior may no longer match training assumptions.', ['ml1-record-experiment-result', 'ml1-identify-dataset-bias'], 0.76, ['drift', 'monitoring']]]
  },
  'ml1-ml-project-plan': {
    title: 'Plan an ML project',
    objective: 'Plan an end-to-end ML project from goal to monitoring.',
    core: 'An ML project plan should connect the decision goal, data source, modeling task, evaluation metric, deployment context, and monitoring strategy.',
    example: 'A support-ticket triage model needs a target decision, labeled examples, an evaluation metric, fallback behavior, and drift checks.',
    steps: ['Define the decision the model supports.', 'Specify data, task type, metric, and baseline.', 'Plan validation, deployment, monitoring, and review.'],
    skills: [['ml1-plan-end-to-end-ml-project', 'Plan end-to-end ML projects', 'Can outline the essential pieces of a responsible first ML project.', ['ml1-detect-model-drift', 'ml1-compare-models-with-validation', 'ml1-explain-neural-training-loop'], 0.84, ['project-planning', 'responsible-ml']]]
  }
}

const lessonPractice = {
  'ml1-define-learning-problems': ['A library wants to predict whether a checked-out book will be returned late. Define the learning problem.', 'The example unit is one checkout. The inputs are borrower history, loan length, due date, and book category. The output is whether the book is returned late.'],
  'ml1-supervised-unsupervised-tasks': ['A music app predicts whether a listener will skip a song, and separately groups listeners by listening patterns. Which task is supervised and which is unsupervised?', 'Predicting whether a listener will skip a song is supervised because it uses a known target. Grouping listeners by listening patterns is unsupervised because it looks for structure without a target label.'],
  'ml1-model-workflow': ['A delivery team trains a late-delivery classifier on past orders, predicts on validation orders, and compares predictions with known outcomes. Identify fit, predict, and evaluate.', 'Fit uses the past orders with known outcomes. Predict produces late-delivery predictions for validation orders. Evaluate compares those predictions with the known validation outcomes.'],
  'ml1-dataset-splits': ['A team trains a model on one split, chooses tree depth on another split, and reports one final score on a third split. Name the role of each split.', 'The training split fits the model. The validation split chooses tree depth. The test split is held back for the final reported score.'],
  'ml1-feature-representation': ['A churn model uses `last_login_before_prediction` and `cancellation_date`. Which feature leaks information?', '`cancellation_date` leaks information because it is known only after churn. `last_login_before_prediction` can be valid if it is available when the prediction is made.'],
  'ml1-data-quality': ['A fraud model is trained only on transactions that employees manually reviewed. What data quality risk should you flag?', 'The data may overrepresent suspicious transactions and underrepresent ordinary transactions, creating collection bias and deployment mismatch.'],
  'ml1-linear-model-predictions': ['A model predicts `10 + 2 * size - 3 * distance`. What is the prediction when `size = 4` and `distance = 1`?', 'The prediction is 10 + 2 * 4 - 3 * 1 = 15.'],
  'ml1-loss-functions': ['Using squared error, what is the loss when the prediction is 8 and the target is 5?', 'The error is 8 - 5 = 3, so squared error is 3 * 3 = 9.'],
  'ml1-gradient-descent': ['A weight is 2.0, its gradient is +4, and the learning rate is 0.1. What is the next weight?', 'Gradient descent subtracts learning rate times gradient, so the next weight is 2.0 - 0.1 * 4 = 1.6.'],
  'ml1-feature-scaling': ['A distance-based model uses age around 30 and income around 80000. What scaling issue appears?', 'Income can dominate distances because its numbers are much larger. Fit scaling values on training data and apply the same transformation to validation and future data.'],
  'ml1-logistic-model': ['A spam model outputs 0.76 and the decision threshold is 0.5. What class is predicted?', '0.76 is above 0.5, so the model predicts the positive class, spam.'],
  'ml1-decision-thresholds': ['A model score is 0.62. What happens at threshold 0.70, and what happens if the threshold is lowered to 0.50?', 'At 0.70 the case is predicted negative. Lowering the threshold to 0.50 makes the same case positive and increases positive predictions.'],
  'ml1-confusion-matrix': ['A classifier predicts positive, but the actual class is negative. What confusion-matrix cell is this?', 'A positive prediction for an actually negative case is a false positive.'],
  'ml1-classification-metrics': ['For rare disease screening, missing true cases is the most costly error. Which metric should receive special attention?', 'Recall should receive special attention because it measures how many actual positives are found.'],
  'ml1-overfitting-underfitting': ['A model has 99% training accuracy and 60% validation accuracy. What is the likely diagnosis?', 'The model is likely overfitting because training performance is excellent while validation performance is much worse.'],
  'ml1-regularization': ['A linear model has very large weights, excellent training fit, and weak validation performance. What regularization change is reasonable?', 'Increase regularization strength to penalize large weights and prefer a simpler model that may generalize better.'],
  'ml1-cross-validation': ['In five-fold cross-validation, how many validation runs happen and how is validation chosen?', 'Five validation runs happen. Each fold acts as validation once while the other folds are used for training.'],
  'ml1-hyperparameter-tuning': ['A team wants to choose tree depth and report final performance. Which split chooses depth and which split reports the final score?', 'Validation data chooses tree depth. The untouched test data reports the final score after choices are made.'],
  'ml1-decision-tree-splits': ['A tree first asks whether missed payments are greater than zero, then routes yes cases to high risk. How is a customer with two missed payments routed?', 'Start at the root, apply the missed-payment test, follow the yes branch, and reach the high-risk prediction.'],
  'ml1-tree-overfitting': ['A tree keeps splitting until each leaf contains one training customer. What risk does this create?', 'The tree may memorize training details instead of reusable patterns, so it is at high risk of overfitting.'],
  'ml1-ensemble-intuition': ['Why can averaging many varied trees be more stable than using one tree?', 'Individual tree errors can differ, so averaging many varied trees reduces dependence on any one unstable split pattern.'],
  'ml1-clustering-framing': ['A retailer wants to group stores by sales mix and visit frequency without target labels. Define the clustering setup.', 'The example unit is one store. The features are sales mix and visit frequency. The clusters are hypotheses about store similarity, not ground truth labels.'],
  'ml1-kmeans-tracing': ['In k-means, one cluster has points 0 and 2 on a line. Where does its centroid move?', 'The centroid moves to the mean of assigned points, so it moves to (0 + 2) / 2 = 1.'],
  'ml1-dimensionality-reduction': ['A dataset has 100 product-behavior features and is projected to 2 dimensions for inspection. What is gained and what is lost?', 'The 2D view can make selected structure easier to inspect, but it discards some information from the original 100 features.'],
  'ml1-anomaly-detection': ['Normal sensor temperature is usually 20 to 25, and a new reading is 40. How should anomaly detection reason about it?', 'The reading is far outside the normal pattern, so it should receive a high anomaly score and may be flagged if it crosses the alert threshold.'],
  'ml1-neuron-computation': ['A neuron has inputs 2 and 3, weights 0.5 and 1, bias -1, and ReLU activation. What is the output?', 'The weighted sum is 2 * 0.5 + 3 * 1 - 1 = 3. ReLU keeps positive values, so the output is 3.'],
  'ml1-network-architecture': ['A binary classifier has 10 input features, hidden layers, and one output score. What role does each part play?', 'The input layer receives the 10 features. Hidden layers build intermediate representations. The output layer produces one score for the binary decision.'],
  'ml1-training-neural-networks': ['A batch passes through a neural network, produces predictions, and then updates weights. Name the training steps.', 'Run a forward pass, compute loss, propagate gradients backward, and update the parameters.'],
  'ml1-pipelines-and-preprocessing': ['A scaler is used before a model. Which data should fit the scaler, and how should validation data be handled?', 'Fit the scaler on training data only. Transform validation data using the scaler fitted on training data.'],
  'ml1-model-comparison': ['Two classifiers are compared for missed-positive cost. How should the comparison be made?', 'Choose recall before comparing, evaluate both models on the same validation setup, and select based on that evidence and constraints.'],
  'ml1-experiment-tracking': ['What must be recorded to make a model result reproducible?', 'Record the data version, split identity, preprocessing, model type, hyperparameters, metric, and conclusion.'],
  'ml1-dataset-bias': ['A hiring model is trained only on past hires. What bias risk should be checked?', 'The data may encode past screening decisions rather than job-relevant ability, so representation and group performance should be checked.'],
  'ml1-model-monitoring': ['A demand model was trained before a holiday season and input patterns now shift. What should monitoring do?', 'Track input distributions, predictions, and outcomes, then investigate drift before retraining blindly.'],
  'ml1-ml-project-plan': ['A support team wants automatic ticket triage. What should the ML project plan specify?', 'Specify the decision the model supports, data and labels, task type, metric, baseline, validation plan, deployment context, monitoring, and review process.']
}

const practiceDistractors = {
  'ml1-define-learning-problems': [
    'The example unit is the entire library. The input is whether the book was late. The label is the borrower history.',
    'The example unit is one librarian. The inputs are all books in the library. The label is the checkout date.'
  ],
  'ml1-supervised-unsupervised-tasks': [
    'Both tasks are supervised because both use customer behavior data.',
    'Both tasks are unsupervised because neither task needs examples.'
  ],
  'ml1-dataset-splits': [
    'The test split chooses tree depth, and the validation split reports the final score.',
    'The same split should be used for training, tuning, and final reporting.'
  ],
  'ml1-feature-representation': [
    '`last_login_before_prediction` leaks information because every date is forbidden.',
    'No feature can leak information if it improves validation performance.'
  ],
  'ml1-confusion-matrix': [
    'This is a true positive because the model predicted positive.',
    'This is a false negative because the actual class is negative.'
  ],
  'ml1-overfitting-underfitting': [
    'The model is underfitting because training accuracy is high.',
    'The model has no validation problem because training accuracy is excellent.'
  ]
}

function upsertById(items, item) {
  const index = items.findIndex((candidate) => candidate.id === item.id)
  if (index === -1) return [...items, item]
  const next = [...items]
  next[index] = item
  return next
}

function assessmentIdForLesson(lessonId) {
  return `assessment-${lessonId}`
}

const moduleRecords = modules.map((module) => ({
  id: module.id,
  courseId: 'ml1-machine-learning-foundations',
  badge: module.badge,
  title: module.title,
  summary: module.summary,
  lessonIds: module.lessons,
  skillIds: module.lessons.flatMap((lessonId) => lessons[lessonId].skills.map(([id]) => id))
}))

const skillRecords = Object.entries(lessons).flatMap(([lessonId, lesson]) => lesson.skills.map(([id, title, description, prerequisites, difficulty, tags]) => ({
  id,
  title,
  description,
  prerequisiteSkillIds: prerequisites,
  lessonIds: [lessonId],
  masteryAssessmentIds: [assessmentIdForLesson(lessonId)],
  reviewIds: [`review-${id}`],
  metadata: { domain: 'machine-learning', difficulty, tags }
})))

const course = {
  id: 'ml1-machine-learning-foundations',
  trackId: track.id,
  title: 'ML1: Machine Learning Foundations',
  tagline: 'Modeling, prediction, evaluation, and responsible ML practice for math-ready learners.',
  description: 'A first machine-learning course for learners who already have the needed math background and want to focus directly on ML concepts, model behavior, and practical workflow.',
  moduleIds: moduleRecords.map((module) => module.id),
  entryAssessmentId: 'diagnostic-ml1-foundations',
  dailyXpGoal: 35,
  weeklyStudyDays: 4
}

const lessonRecords = Object.entries(lessons).map(([id, lesson]) => {
  const skillIds = lesson.skills.map(([skillId]) => skillId)
  const taught = new Set(skillIds)
  const prerequisites = [...new Set(lesson.skills.flatMap(([, , , prerequisiteIds]) => prerequisiteIds))].filter((skillId) => !taught.has(skillId))
  const module = moduleRecords.find((candidate) => candidate.lessonIds.includes(id))

  return {
    id,
    moduleId: module.id,
    title: lesson.title,
    summary: lesson.core,
    objective: lesson.objective,
    estimatedMinutes: skillIds.length > 1 ? 18 : 14,
    skillIds,
    prerequisiteSkillIds: prerequisites,
    sections: [{ id: `${id}-lesson`, title: 'Lesson', body: [`${lesson.core} To solve this lesson's questions, use this procedure: ${(lesson.method ?? lesson.steps).join(' ')}`] }],
    workedExamples: [{ id: `${id}-example-1`, prompt: lesson.example, steps: [lesson.steps.join(' ')] }],
    assessmentId: assessmentIdForLesson(id),
    metadata: { author: 'core-team', status: 'complete' }
  }
})

function practiceForLesson(lessonId, lesson, title) {
  return lessonPractice[lessonId] ?? [
    lesson.question ?? `Which answer correctly applies this lesson to a similar case: ${title}?`,
    lesson.solution ?? (lesson.method ?? lesson.steps).join(' ')
  ]
}

function optionsForPractice(lessonId, solution) {
  const distractors = practiceDistractors[lessonId] ?? [
    'Choose the most complex model first and judge it only by training performance.',
    'Use information that would only be known after the prediction or evaluation is complete.'
  ]
  return [solution, ...distractors]
}

function lessonAssessment(lesson) {
  const skills = lesson.skillIds.map((id) => skillRecords.find((skill) => skill.id === id))
  const primary = skills[0]
  const source = lessons[lesson.id]
  const [question, solution] = practiceForLesson(lesson.id, source, lesson.title)
  const options = optionsForPractice(lesson.id, solution)
  return {
    id: lesson.assessmentId,
    type: 'lesson-check',
    title: `Lesson check: ${lesson.title}`,
    description: `Choose the answer that applies this lesson's procedure to a new case.`,
    skillIds: lesson.skillIds,
    lessonId: lesson.id,
    items: [
      { id: `${lesson.id}-check-1`, skillId: primary.id, type: 'multiple-choice', prompt: question, options, correctAnswer: solution, explanation: solution }
    ],
    passRule: { minCorrect: 1, maxAttemptsBeforeReview: 2 },
    metadata: { difficulty: Math.max(...skills.map((skill) => skill.metadata.difficulty)), calculatorAllowed: false }
  }
}

const diagnostic = {
  id: 'diagnostic-ml1-foundations',
  type: 'diagnostic',
  title: 'ML1 entry diagnostic',
  description: 'Checks readiness for ML problem framing, dataset splitting, model evaluation, and generalization reasoning.',
  skillIds: ['ml1-identify-learning-problem', 'ml1-map-examples-features-labels', 'ml1-split-train-validation-test', 'ml1-read-confusion-matrix', 'ml1-diagnose-overfitting-underfitting'],
  items: [
    { id: 'diag-ml1-task-1', skillId: 'ml1-identify-learning-problem', type: 'multiple-choice', prompt: 'A model predicts tomorrow\'s electricity demand from past demand and weather. What kind of task is this?', options: ['Supervised regression', 'Unsupervised clustering', 'Manual reporting'], correctAnswer: 'Supervised regression', explanation: 'The task predicts a numeric target from labeled historical examples.' },
    { id: 'diag-ml1-features-1', skillId: 'ml1-map-examples-features-labels', type: 'multiple-choice', prompt: 'In a spam classifier, what is the label?', options: ['The email text', 'Whether the email is spam', 'The model weight vector'], correctAnswer: 'Whether the email is spam', explanation: 'The label is the target outcome the supervised model learns to predict.' },
    { id: 'diag-ml1-split-1', skillId: 'ml1-split-train-validation-test', type: 'multiple-choice', prompt: 'Which split should be used for final performance reporting after model selection?', options: ['Training set', 'Validation set', 'Test set'], correctAnswer: 'Test set', explanation: 'The test set estimates final performance after choices have been made.' },
    { id: 'diag-ml1-confusion-1', skillId: 'ml1-read-confusion-matrix', type: 'multiple-choice', prompt: 'A model predicts positive, but the actual class is negative. What is this case?', options: ['True positive', 'False positive', 'False negative'], correctAnswer: 'False positive', explanation: 'The positive prediction is wrong because the actual class is negative.' },
    { id: 'diag-ml1-overfit-1', skillId: 'ml1-diagnose-overfitting-underfitting', type: 'multiple-choice', prompt: 'Training score is excellent but validation score is poor. What is the likely issue?', options: ['Overfitting', 'No labels exist', 'The test set is too protected'], correctAnswer: 'Overfitting', explanation: 'A large train-validation gap is a classic overfitting signal.' }
  ],
  passRule: { minCorrect: 3, maxAttemptsBeforeReview: 1 },
  metadata: { difficulty: 0.56, calculatorAllowed: false }
}

const assessments = [diagnostic, ...lessonRecords.map(lessonAssessment)]
const reviews = []
for (const skill of skillRecords) {
  const assessmentId = `review-assessment-${skill.id}`
  assessments.push({
    id: assessmentId,
    type: 'review',
    title: `Review: ${skill.title}`,
    description: `Short review for ${skill.title.toLowerCase()}.`,
    skillIds: [skill.id],
    items: [{ id: `review-${skill.id}-1`, skillId: skill.id, type: 'multiple-choice', prompt: `What makes ${skill.title.toLowerCase()} reliable in ML practice?`, options: ['Evidence from the task, data split, and evaluation metric', 'Training accuracy alone', 'Choosing the newest algorithm by default'], correctAnswer: 'Evidence from the task, data split, and evaluation metric', explanation: 'Reliable ML reasoning connects modeling choices to the task, data, and held-out evidence.' }],
    passRule: { minCorrect: 1 },
    metadata: { difficulty: skill.metadata.difficulty, calculatorAllowed: false }
  })
  reviews.push({ id: skill.reviewIds[0], skillId: skill.id, title: `Review for ${skill.title}`, assessmentId, initialIntervalDays: Math.max(2, Math.round(2 + skill.metadata.difficulty * 5)) })
}

curriculum.tracks = upsertById(curriculum.tracks, track)
curriculum.courses = upsertById(curriculum.courses, course)
for (const module of moduleRecords) curriculum.modules = upsertById(curriculum.modules, module)
for (const skill of skillRecords) curriculum.skills = upsertById(curriculum.skills, skill)

const ownedLessonIds = new Set(lessonRecords.map((lesson) => lesson.id))
const ownedAssessmentIds = new Set(assessments.map((assessment) => assessment.id))
const ownedReviewIds = new Set(reviews.map((review) => review.id))

curriculum.lessons = [...curriculum.lessons.filter((lesson) => !ownedLessonIds.has(lesson.id)), ...lessonRecords]
curriculum.assessments = [
  ...curriculum.assessments.filter((assessment) => !ownedAssessmentIds.has(assessment.id)),
  ...assessments,
]
curriculum.reviews = [...curriculum.reviews.filter((review) => !ownedReviewIds.has(review.id)), ...reviews]

writeFileSync(path, `${JSON.stringify(curriculum, null, 2)}\n`)
